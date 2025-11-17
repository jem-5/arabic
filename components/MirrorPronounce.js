// MirrorPronounce.jsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import Meyda from "meyda";
import DynamicTimeWarping from "dynamic-time-warping";

/**
 * MirrorPronounce
 * - Play reference audio (you provide the URL)
 * - Record user audio
 * - Process both: silence removal + normalization + frame-wise MFCC
 * - Compare with DTW and show similarity %
 *
 * Props:
 * - referenceUrl: string (URL to the reference audio file, mp3/wav)
 * - mfccOptions: optional config (frameSize, hopSize, mfccCount)
 */
export default function MirrorPronounce({
  referenceUrl,
  mfccOptions = { frameSize: 1024, hopSize: 512, mfccCount: 13 },
  // Tunables (can be overridden by props)
  dtwSigma = 10,
  cosThreshold = 40,
  includeDelta = true,
  includeDeltaDelta = true,
  includeSpectral = true,
  normalizeAugmented = true,
}) {
  // UI state
  const [isRecording, setIsRecording] = useState(false);
  const [similarity, setSimilarity] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | ready | recording | processing | done | error
  const [error, setError] = useState(null);
  const [audioURL, setAudioURL] = useState(null); // user recording blob url
  const [refLoaded, setRefLoaded] = useState(false);
  const [analysisAvailable, setAnalysisAvailable] = useState(true);
  // Local tunable state (allows quick UI tweaking)
  const [dtwSigmaLocal, setDtwSigmaLocal] = useState(dtwSigma);
  const [cosThresholdLocal, setCosThresholdLocal] = useState(cosThreshold);
  const [includeDeltaLocal, setIncludeDeltaLocal] = useState(includeDelta);
  const [includeDeltaDeltaLocal, setIncludeDeltaDeltaLocal] =
    useState(includeDeltaDelta);
  const [includeSpectralLocal, setIncludeSpectralLocal] =
    useState(includeSpectral);
  const [normalizeAugLocal, setNormalizeAugLocal] =
    useState(normalizeAugmented);
  const [showDebug, setShowDebug] = useState(false);
  const [lastDiagnostics, setLastDiagnostics] = useState(null);

  // Refs for audio + web audio context
  const audioCtxRef = useRef(null);
  const refBufferRef = useRef(null); // AudioBuffer for reference audio
  const audioElemRef = useRef(null); // fallback HTMLAudioElement
  const playableOnlyRef = useRef(false); // true when we can only play via <audio> (no decoded buffer)
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const sourceNodeRef = useRef(null);
  const analyserRef = useRef(null);

  // Ensure AudioContext is created on user gesture
  const ensureAudioContext = () => {
    if (!audioCtxRef.current) {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ac;
    }
    return audioCtxRef.current;
  };

  // Load reference audio into AudioBuffer (decode)
  useEffect(() => {
    let canceled = false;
    async function loadRef() {
      try {
        setStatus("processing");
        const ac = ensureAudioContext();
        const resp = await fetch(referenceUrl, { mode: "cors" });
        console.log("loadRef fetch: status", resp.status, "type", resp.type);
        const contentType = resp.headers.get("content-type");
        console.log("loadRef content-type:", contentType);

        if (!resp.ok) {
          throw new Error("Failed to fetch reference audio: " + resp.status);
        }

        const arr = await resp.arrayBuffer();
        try {
          const buf = await ac.decodeAudioData(arr);
          if (!canceled) {
            refBufferRef.current = buf;
            playableOnlyRef.current = false;
            setAnalysisAvailable(true);
            setRefLoaded(true);
            setStatus("ready");
          }
        } catch (decodeErr) {
          // decodeAudioData can fail due to unsupported codec or CORS/opaque responses
          console.warn("decodeAudioData failed:", decodeErr);
          // Fallback: use HTMLAudioElement for playback only (may still play even if decode fails)
          try {
            if (audioElemRef.current) {
              try {
                audioElemRef.current.pause();
              } catch {}
              audioElemRef.current.src = referenceUrl;
            } else {
              const a = new Audio(referenceUrl);
              a.crossOrigin = "anonymous";
              audioElemRef.current = a;
            }
            playableOnlyRef.current = true;
            setAnalysisAvailable(false);
            setRefLoaded(true);
            setStatus("ready");
            console.info(
              "Reference audio loaded in fallback (HTMLAudioElement). Analysis disabled until CORS/codec fixed."
            );
          } catch (fbErr) {
            console.error("Fallback audio element failed:", fbErr);
            throw decodeErr;
          }
        }
      } catch (e) {
        console.error("Failed loading reference audio", e);
        // give more diagnostic info for the user
        setError("Failed to load reference audio: " + (e.message || e));
        setStatus("error");
      }
    }
    loadRef();
    return () => {
      canceled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referenceUrl]);

  // Play reference audio
  const playReference = () => {
    // If we only have an HTMLAudioElement (decode failed), use it for playback
    if (!refBufferRef.current) {
      if (audioElemRef.current) {
        audioElemRef.current.play().catch((e) => {
          console.error("audioElemRef play failed:", e);
          setError("Could not play reference audio.");
          setStatus("error");
        });
        return;
      }
      // nothing to play
      return;
    }
    try {
      const ac = ensureAudioContext();
      // Some browsers create AudioContext in suspended state if not created by a user gesture.
      // Resume it on user interaction before playing.
      if (ac.state === "suspended") {
        // resume returns a promise
        ac.resume().catch((e) => {
          console.warn("AudioContext resume failed:", e);
        });
      }

      // If a previous source is playing, stop it cleanly
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop();
        } catch (e) {}
        try {
          sourceNodeRef.current.disconnect();
        } catch (e) {}
        sourceNodeRef.current = null;
      }

      const src = ac.createBufferSource();
      src.buffer = refBufferRef.current;
      src.connect(ac.destination);
      src.onended = () => {
        // clear ref when finished
        try {
          if (sourceNodeRef.current === src) sourceNodeRef.current = null;
        } catch (e) {}
      };
      src.start();
      sourceNodeRef.current = src;
      setStatus("ready");
    } catch (err) {
      console.error("playReference failed:", err);
      // Try fallback: use an HTMLAudioElement to play the reference URL
      try {
        if (audioElemRef.current) {
          try {
            audioElemRef.current.pause();
          } catch {}
          audioElemRef.current.src = referenceUrl;
        } else {
          const a = new Audio(referenceUrl);
          // ensure CORS allowed if hosted on CDN
          a.crossOrigin = "anonymous";
          audioElemRef.current = a;
        }
        // play returns a promise; handle rejection
        audioElemRef.current
          .play()
          .then(() => {
            setStatus("ready");
          })
          .catch((playErr) => {
            console.error("HTMLAudioElement play failed:", playErr);
            setError("Could not play reference audio.");
            setStatus("error");
          });
      } catch (fallbackErr) {
        console.error("playReference fallback failed:", fallbackErr);
        setError("Could not play reference audio.");
        setStatus("error");
      }
    }
  };

  // Start recording (MediaRecorder) — stores raw chunks
  const startRecording = async () => {
    setError(null);
    setSimilarity(null);
    recordedChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        // also decode to AudioBuffer for analysis
        await processUserRecording(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatus("recording");
    } catch (e) {
      console.error("microphone error", e);
      setError("Microphone access denied or not available.");
      setStatus("error");
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      // stop tracks
      try {
        mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      } catch {}
    }
    setIsRecording(false);
    setStatus("processing");
  };

  // Convert AudioBuffer to mono Float32Array (mixdown)
  const audioBufferToFloat32 = (audioBuffer) => {
    const chCount = audioBuffer.numberOfChannels;
    const len = audioBuffer.length;
    const out = new Float32Array(len);
    if (chCount === 1) {
      audioBuffer.copyFromChannel(out, 0, 0);
      return out;
    }
    // mixdown to mono by averaging channels
    const tmp = new Float32Array(len * chCount);
    for (let c = 0; c < chCount; c++) {
      const channel = new Float32Array(len);
      audioBuffer.copyFromChannel(channel, c, 0);
      for (let i = 0; i < len; i++) out[i] = out[i] + channel[i] / chCount;
    }
    return out;
  };

  // Silence removal (simple energy threshold on short frames)
  const removeSilence = (
    samples,
    sampleRate,
    threshold = 0.01,
    minSegmentMs = 150
  ) => {
    // compute RMS per small window (e.g., 20 ms)
    const winMs = 20;
    const winSize = Math.floor((winMs / 1000) * sampleRate);
    const hop = winSize;
    const rms = [];
    for (let i = 0; i < samples.length; i += hop) {
      let sum = 0;
      const end = Math.min(samples.length, i + winSize);
      for (let j = i; j < end; j++) sum += samples[j] * samples[j];
      const r = Math.sqrt(sum / (end - i || 1));
      rms.push({ pos: i, val: r });
    }
    // find frames above threshold
    const activeFrames = rms.filter((r) => r.val > threshold);
    if (activeFrames.length === 0) return new Float32Array(0);
    // form continuous segments
    const minSegSamples = Math.floor((minSegmentMs / 1000) * sampleRate);
    let segments = [];
    let segStart = activeFrames[0].pos;
    let prevPos = activeFrames[0].pos;
    for (let k = 1; k < activeFrames.length; k++) {
      if (activeFrames[k].pos - prevPos > winSize * 2) {
        // gap -> end segment
        segments.push([segStart, prevPos + winSize]);
        segStart = activeFrames[k].pos;
      }
      prevPos = activeFrames[k].pos;
    }
    segments.push([segStart, prevPos + winSize]);

    // merge and enforce min length
    const good = segments.filter(([s, e]) => e - s >= minSegSamples);
    if (good.length === 0) return new Float32Array(0);

    // concatenate segments
    let totalLen = good.reduce((acc, [s, e]) => acc + (e - s), 0);
    const out = new Float32Array(totalLen);
    let offset = 0;
    for (const [s, e] of good) {
      out.set(samples.subarray(s, e), offset);
      offset += e - s;
    }
    return out;
  };

  // Normalize - scale to max absolute = 0.98 (avoid hard clipping)
  const normalize = (samples) => {
    if (!samples || samples.length === 0) return samples;
    let max = 0;
    for (let i = 0; i < samples.length; i++) {
      const a = Math.abs(samples[i]);
      if (a > max) max = a;
    }
    if (max === 0) return samples;
    const scale = 0.98 / max;
    const out = new Float32Array(samples.length);
    for (let i = 0; i < samples.length; i++) out[i] = samples[i] * scale;
    return out;
  };

  // Frame-wise MFCC extraction (returns array of feature vectors per frame)
  // Options:
  //  - frameSize, hopSize, mfccCount
  //  - includeSpectral: include spectral features (centroid, flux)
  const extractMFCCFrames = (samples, sampleRate, opts = {}) => {
    const frameSize = opts.frameSize || mfccOptions.frameSize || 1024;
    const hopSize = opts.hopSize || mfccOptions.hopSize || 512;
    const mfccCount = opts.mfccCount || mfccOptions.mfccCount || 13;
    const includeSpectral =
      opts.includeSpectral !== undefined ? opts.includeSpectral : true;
    const mfccSeq = [];
    // Meyda needs an object context (it can be used statelessly with extract passing sample array).
    // We'll call Meyda.extract for each frame with the signal (frame) and sampleRate in options.
    // Handle very short signals by padding to frameSize so we always extract at least one frame.
    if (!samples || samples.length === 0) return mfccSeq;
    const effectiveFrames =
      samples.length >= frameSize
        ? Math.floor((samples.length - frameSize) / hopSize) + 1
        : 1;

    for (let f = 0; f < effectiveFrames; f++) {
      const i = f * hopSize;
      let frame = samples.subarray(i, i + frameSize);
      if (frame.length < frameSize) {
        const padded = new Float32Array(frameSize);
        padded.set(frame, 0);
        frame = padded;
      }
      try {
        const features = Meyda.extract("mfcc", frame, {
          bufferSize: frameSize,
          sampleRate,
          mfcc: { numberOfCoefficients: mfccCount },
        });
        // Meyda may return either an array (mfcc directly) or an object { mfcc: [...] }
        let arr = null;
        if (Array.isArray(features)) arr = features;
        else arr = features?.mfcc || null;
        if (arr && arr.length) {
          // base MFCCs
          const base = arr.slice(0, mfccCount);
          // optionally compute simple spectral features and append
          if (includeSpectral) {
            try {
              // spectralCentroid and spectralFlux are single-number features
              const centroid = Meyda.extract("spectralCentroid", frame, {
                bufferSize: frameSize,
                sampleRate,
              });
              const flux = Meyda.extract("spectralFlux", frame, {
                bufferSize: frameSize,
                sampleRate,
              });
              // Meyda may return number or object; coerce to number
              const centVal =
                typeof centroid === "number" ? centroid : centroid?.value || 0;
              const fluxVal =
                typeof flux === "number" ? flux : flux?.value || 0;
              mfccSeq.push(base.concat([centVal || 0, fluxVal || 0]));
            } catch (sfErr) {
              // if spectral features fail, still push MFCCs
              mfccSeq.push(base);
            }
          } else {
            mfccSeq.push(base);
          }
        } else {
          // debug: log when Meyda returns unexpected shape
          // console.debug('extractMFCCFrames: Meyda returned', features);
        }
      } catch (e) {
        // On failure, skip frame
        // console.warn("meyda extract fail", e);
      }
    }

    // debug log frame count
    // console.debug("extractMFCCFrames: samples", samples.length, "frames", mfccSeq.length);

    // If no frames extracted (Meyda may fail on some builds), attempt a single-frame fallback
    if (mfccSeq.length === 0) {
      try {
        // choose a reasonable buffer size (power of two)
        const chooseBuf = (len) => {
          const preferred = [4096, 2048, 1024, 512, 256];
          for (const p of preferred) if (len >= p) return p;
          return 256;
        };
        const fb = chooseBuf(samples.length);
        const frame =
          samples.length >= fb
            ? samples.subarray(0, fb)
            : (() => {
                const p = new Float32Array(fb);
                p.set(samples, 0);
                return p;
              })();
        const features = Meyda.extract("mfcc", frame, {
          bufferSize: fb,
          sampleRate,
        });
        let arr = null;
        if (Array.isArray(features)) arr = features;
        else arr = features?.mfcc || null;
        if (arr && arr.length) {
          mfccSeq.push(arr.slice(0, mfccCount));
          console.info(
            `extractMFCCFrames: fallback extracted 1 frame (buffer ${fb})`
          );
        } else {
          console.warn("extractMFCCFrames: fallback produced no features", {
            fb,
            sampleRate,
            features,
          });
        }
      } catch (err) {
        console.warn("extractMFCCFrames fallback failed:", err);
      }
    }
    return mfccSeq;
  };

  // Augment MFCC sequence with delta and delta-delta features and optionally normalize per-coefficient
  const augmentAndNormalizeMFCC = (mfccSeq, opts = {}) => {
    const includeDelta =
      opts.includeDelta !== undefined ? opts.includeDelta : true;
    const includeDeltaDelta =
      opts.includeDeltaDelta !== undefined ? opts.includeDeltaDelta : true;
    const normalizeSeq = opts.normalize !== undefined ? opts.normalize : true;
    if (!mfccSeq || mfccSeq.length === 0) return [];
    const frames = mfccSeq.length;
    const coeffs = mfccSeq[0].length;

    // compute delta (first difference) using central differences
    const delta = Array.from({ length: frames }, (_, i) =>
      new Array(coeffs).fill(0)
    );
    for (let i = 0; i < frames; i++) {
      const prev = mfccSeq[Math.max(0, i - 1)];
      const next = mfccSeq[Math.min(frames - 1, i + 1)];
      for (let j = 0; j < coeffs; j++) {
        delta[i][j] = (next[j] - prev[j]) / 2;
      }
    }

    // compute delta-delta (second difference) from delta sequence
    const delta2 = Array.from({ length: frames }, (_, i) =>
      new Array(coeffs).fill(0)
    );
    if (includeDeltaDelta) {
      for (let i = 0; i < frames; i++) {
        const prev = delta[Math.max(0, i - 1)];
        const next = delta[Math.min(frames - 1, i + 1)];
        for (let j = 0; j < coeffs; j++) {
          delta2[i][j] = (next[j] - prev[j]) / 2;
        }
      }
    }

    // build augmented vectors
    const aug = mfccSeq.map((v, i) => {
      let out = v.slice();
      if (includeDelta) out = out.concat(delta[i]);
      if (includeDeltaDelta) out = out.concat(delta2[i]);
      return out;
    });

    if (normalizeSeq) {
      // per-coefficient mean/std across frames
      const dim = aug[0].length;
      const means = new Array(dim).fill(0);
      const stds = new Array(dim).fill(0);
      // mean
      for (let i = 0; i < frames; i++) {
        const v = aug[i];
        for (let d = 0; d < dim; d++) means[d] += v[d] / frames;
      }
      // variance
      for (let i = 0; i < frames; i++) {
        const v = aug[i];
        for (let d = 0; d < dim; d++) {
          const diff = v[d] - means[d];
          stds[d] += (diff * diff) / frames;
        }
      }
      for (let d = 0; d < dim; d++) stds[d] = Math.sqrt(stds[d]) || 1e-8;
      // apply z-score
      for (let i = 0; i < frames; i++) {
        for (let d = 0; d < dim; d++) {
          aug[i][d] = (aug[i][d] - means[d]) / stds[d];
        }
      }
    }
    return aug;
  };

  // Distance between two MFCC vectors (Euclidean)
  const vecDistance = (a, b) => {
    let s = 0;
    const n = Math.min(a.length, b.length);
    for (let i = 0; i < n; i++) s += (a[i] - b[i]) ** 2;
    return Math.sqrt(s);
  };

  // Mean vector across a sequence of vectors
  const meanVector = (seq) => {
    if (!seq || seq.length === 0) return null;
    const n = seq.length;
    const m = seq[0].length;
    const out = new Array(m).fill(0);
    for (let i = 0; i < n; i++) {
      const v = seq[i];
      for (let j = 0; j < m; j++) out[j] += v[j] / n;
    }
    return out;
  };

  // Cosine similarity between two vectors
  const cosineSimilarity = (a, b) => {
    if (!a || !b) return 0;
    const n = Math.min(a.length, b.length);
    let dot = 0;
    let na = 0;
    let nb = 0;
    for (let i = 0; i < n; i++) {
      dot += a[i] * b[i];
      na += a[i] * a[i];
      nb += b[i] * b[i];
    }
    if (na === 0 || nb === 0) return 0;
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
  };

  // Compute DTW distance between two sequences of MFCC vectors
  const computeDTW = (seqA, seqB) => {
    if (!seqA.length || !seqB.length) return Infinity;
    // dynamic-time-warping expects sequences and a distance fn between elements
    const dtw = new DynamicTimeWarping(seqA, seqB, (x, y) => vecDistance(x, y));
    return dtw.getDistance();
  };

  // Convert blob (webm) to AudioBuffer
  const blobToAudioBuffer = async (blob) => {
    const ac = ensureAudioContext();
    const arr = await blob.arrayBuffer();
    return await ac.decodeAudioData(arr);
  };

  // process user recording: decode -> mixdown -> silence removal -> normalization -> extract MFCCs -> compare
  const processUserRecording = async (blob) => {
    try {
      setStatus("processing");
      const ac = ensureAudioContext();
      // decode user
      const userBuf = await blobToAudioBuffer(blob);
      const userSamples = audioBufferToFloat32(userBuf);
      const userMono = userSamples; // already mixed
      // silence removal & normalize
      let userTrimmed = normalize(
        removeSilence(userMono, userBuf.sampleRate, 0.008, 120)
      );
      let usedRawBecauseTrimmed = false;
      if (userTrimmed.length === 0) {
        // Silence removal may be too aggressive in some environments.
        // Fall back to the raw decoded samples so we can still extract features
        // and diagnose the MFCC pipeline instead of failing early.
        console.warn(
          "removeSilence trimmed entire recording — falling back to raw samples for extraction"
        );
        userTrimmed = normalize(userMono);
        usedRawBecauseTrimmed = true;
      }

      // Handle reference buffer
      const refBuf = refBufferRef.current;
      if (!refBuf) {
        setError("Reference not loaded");
        setStatus("error");
        return;
      }
      const refSamples = audioBufferToFloat32(refBuf);
      const refTrimmed = normalize(
        removeSilence(refSamples, refBuf.sampleRate, 0.008, 120)
      );
      if (refTrimmed.length === 0) {
        // fallback: use full reference
        console.warn("Reference trimmed to empty; using full ref");
      }

      // Extract MFCC sequences (frame-wise)
      // debug: log lengths before extraction
      console.debug(
        "processUserRecording: refSamples.length",
        refSamples.length,
        "refTrimmed.length",
        refTrimmed.length
      );
      console.debug(
        "processUserRecording: userSamples.length",
        userSamples.length,
        "userTrimmed.length",
        userTrimmed.length
      );

      const refToUse = refTrimmed.length ? refTrimmed : refSamples;
      const refMFCC = extractMFCCFrames(refToUse, refBuf.sampleRate, {
        includeSpectral: includeSpectralLocal,
        frameSize: mfccOptions.frameSize,
        hopSize: mfccOptions.hopSize,
        mfccCount: mfccOptions.mfccCount,
      });
      const userMFCC = extractMFCCFrames(userTrimmed, userBuf.sampleRate, {
        includeSpectral: includeSpectralLocal,
        frameSize: mfccOptions.frameSize,
        hopSize: mfccOptions.hopSize,
        mfccCount: mfccOptions.mfccCount,
      });

      // Augment MFCCs with delta + per-sequence normalization to capture dynamics
      // and reduce global spectral-envelope false positives.
      const refAug = augmentAndNormalizeMFCC(refMFCC, {
        includeDelta: includeDeltaLocal,
        includeDeltaDelta: includeDeltaDeltaLocal,
        normalize: normalizeAugLocal,
      });
      const userAug = augmentAndNormalizeMFCC(userMFCC, {
        includeDelta: includeDeltaLocal,
        includeDeltaDelta: includeDeltaDeltaLocal,
        normalize: normalizeAugLocal,
      });

      console.log(
        "processUserRecording: refMFCC frames",
        refMFCC.length,
        "userMFCC frames",
        userMFCC.length,
        {
          usedRawBecauseTrimmed,
          refSampleRate: refBuf.sampleRate,
          userSampleRate: userBuf.sampleRate,
        }
      );

      // If we did extract some frames, print the first few coeffs so we can see shapes
      if (refAug.length > 0) {
        console.log("refAug[0] (first 5 coeffs)", refAug[0].slice(0, 5));
      }
      if (userAug.length > 0) {
        console.log("userAug[0] (first 5 coeffs)", userAug[0].slice(0, 5));
      }

      if (!refMFCC.length || !userMFCC.length) {
        setError("Couldn't extract features. Try recording a bit longer.");
        setStatus("error");
        return;
      }

      // Compute DTW distance on augmented features
      const distance = computeDTW(refAug, userAug);

      // Convert distance to a similarity percent
      // Old linear mapping was too sensitive to absolute distances. Use a
      // length-normalized, exponential mapping so very large distances still
      // map to a gradual similarity curve. This is heuristic and tunable.
      const normFactor = Math.log(1 + refMFCC.length + userMFCC.length);
      const dtwStepCount = Math.max(1, refMFCC.length + userMFCC.length);
      const dtwPerStep = distance / dtwStepCount;
      // sigma controls how quickly similarity decays with dtwPerStep. Larger => slower decay.
      // Tune DTW_SIGMA to balance true positives vs false positives.
      // Increase slightly from 6 to 10 to boost correct-word scores while
      // still keeping DTW relatively selective.
      const DTW_SIGMA = dtwSigmaLocal || dtwSigma;
      const dtwPercent = Math.round(
        Math.max(0, 100 * Math.exp(-dtwPerStep / DTW_SIGMA))
      );

      // Keep the old rawScore for debugging
      const rawScore = Math.max(0, 1 - distance / (10 * normFactor)); // original clamp-ish for reference
      const percent = dtwPercent;

      // Additional diagnostics: mean MFCC cosine similarity (on augmented features)
      const meanRef = meanVector(refAug);
      const meanUser = meanVector(userAug);
      const meanCos = cosineSimilarity(meanRef, meanUser);

      const diagnostics = {
        distance,
        normFactor,
        rawScore,
        percent,
        meanCos,
        refMFCC_frames: refMFCC.length,
        userMFCC_frames: userMFCC.length,
        dtwPerStep,
      };
      console.log("DTW diagnostics", diagnostics);
      setLastDiagnostics(diagnostics);

      // Cosine-based percent mapping: map [-1,1] -> [0,100]
      let cosPercent = 0;
      if (typeof meanCos === "number" && !Number.isNaN(meanCos)) {
        cosPercent = Math.round(((meanCos + 1) / 2) * 100);
      }

      // Combine DTW and cosine conservatively using geometric mean so both
      // metrics must be high to produce a high final score. Also apply a
      // length-ratio penalty when one sequence is much longer than the other.
      const lenRatio =
        Math.min(refMFCC.length, userMFCC.length) /
        Math.max(refMFCC.length, userMFCC.length);
      const lenFactor = Math.min(1, 0.5 + lenRatio); // maps [0,1] -> [0.5,1]

      // If cosine couldn't be computed (NaN) treat as 0
      const safeCos = Number.isFinite(cosPercent) ? cosPercent : 0;
      const geo = Math.sqrt(dtwPercent * safeCos);
      let finalPercent = Math.round(geo * lenFactor);

      // If DTW failed completely, fall back to cosine (still apply lenFactor)
      if (!isFinite(distance)) {
        console.info("DTW returned Infinity; falling back to cosine percent", {
          cosPercent,
        });
        finalPercent = Math.round(safeCos * lenFactor);
      }

      // Conservative cosine penalty: if cosine similarity is low, reduce final
      // score proportionally so global envelope mismatches strongly lower the
      // final percent. This helps prevent false positives where DTW alone is
      // moderately high but cosine is low.
      const COS_THRESHOLD = cosThresholdLocal || cosThreshold; // percent
      const cosPenalty =
        cosPercent < COS_THRESHOLD ? cosPercent / COS_THRESHOLD : 1;
      const penalizedFinal = Math.round(finalPercent * cosPenalty);

      console.log("Final similarity percent", {
        finalPercent: penalizedFinal,
        dtwPercent,
        cosPercent,
        lenRatio,
        lenFactor,
        geo,
        cosPenalty,
      });

      setSimilarity(penalizedFinal);
      setStatus("done");
    } catch (e) {
      console.error("processUserRecording error", e);
      setError("Failed processing recording: " + (e.message || e));
      setStatus("error");
    }
  };

  // UI helpers
  const onRecordClick = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const reset = () => {
    setSimilarity(null);
    setAudioURL(null);
    setStatus(refLoaded ? "ready" : "idle");
    setError(null);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg  ">
      {/* <h2 className="text-2xl font-semibold mb-4">
        Mirror Pronunciation (DTW + MFCC)
      </h2> */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <button
          onClick={playReference}
          className="col-span-1 sm:col-span-1 bg-blue-500 text-white py-2 px-3 rounded-lg shadow hover:bg-blue-600"
        >
          Play reference
        </button>

        <button
          onClick={onRecordClick}
          className="col-span-1 sm:col-span-1 bg-emerald-500 text-white py-2 px-3 rounded-lg shadow hover:bg-emerald-600"
        >
          {isRecording ? "Stop recording" : "Record"}
        </button>

        <button
          onClick={reset}
          className="col-span-1 sm:col-span-1 bg-gray-200 text-gray-800 py-2 px-3 rounded-lg shadow hover:bg-gray-300"
        >
          Reset
        </button>
      </div>

      {/* If reference is playable but not decodable, show a visible audio player as fallback */}
      {!analysisAvailable && refLoaded && (
        <div className="mb-4">
          <div className="text-sm text-gray-600">
            Reference playback (fallback):
          </div>
          <audio
            className="mt-2"
            controls
            src={referenceUrl}
            crossOrigin="anonymous"
          />
        </div>
      )}

      <div className="mb-3">
        <div className="text-sm text-gray-600">
          Status: <span className="font-medium">{status}</span>
        </div>
        {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
        {!analysisAvailable && (
          <div className="text-sm text-yellow-600 mt-2">
            Reference audio can be played but not decoded for analysis (likely
            CORS or unsupported codec). To enable analysis, host the file with
            CORS headers or put it in the app public folder.
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-600">Preview your recording:</div>
        {audioURL ? (
          <audio className="mt-2" controls src={audioURL} />
        ) : (
          <div className="mt-2 text-xs text-gray-500">No recording yet</div>
        )}
      </div>

      <div className="mb-4">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-2 bg-emerald-500 rounded-full"
            style={{ width: similarity !== null ? `${similarity}%` : "0%" }}
          />
        </div>
        <div className="mt-2 text-sm">
          Similarity:{" "}
          <span className="font-bold">
            {similarity === null ? "—" : `${similarity}%`}
          </span>
        </div>
        {/* <div className="text-xs text-gray-500 mt-1">
          Tip: a result around 60–80% typically indicates good pronunciation.
        </div> */}
      </div>

      {/* Debug / tunables panel (collapsible) */}
      <div className="mt-4">
        <button
          onClick={() => setShowDebug((s) => !s)}
          className="text-sm text-blue-600 underline"
        >
          {showDebug
            ? "Hide diagnostics & tunables"
            : "Show diagnostics & tunables"}
        </button>
        {showDebug && (
          <div className="mt-3 p-3 bg-gray-50 border rounded">
            <div className="mb-2 text-sm font-medium">Tunables</div>
            <div className="mb-2 text-xs">
              <label className="block">DTW sigma: {dtwSigmaLocal}</label>
              <input
                type="range"
                min="2"
                max="100"
                value={dtwSigmaLocal}
                onChange={(e) => setDtwSigmaLocal(Number(e.target.value))}
              />
            </div>
            <div className="mb-2 text-xs">
              <label className="block">
                Cosine threshold: {cosThresholdLocal}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={cosThresholdLocal}
                onChange={(e) => setCosThresholdLocal(Number(e.target.value))}
              />
            </div>
            <div className="mb-2 text-xs">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={includeSpectralLocal}
                  onChange={(e) => setIncludeSpectralLocal(e.target.checked)}
                  className="mr-2"
                />
                Include spectral centroid/flux per-frame
              </label>
            </div>
            <div className="mb-2 text-xs">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={includeDeltaLocal}
                  onChange={(e) => setIncludeDeltaLocal(e.target.checked)}
                  className="mr-2"
                />
                Include delta (1st derivative)
              </label>
            </div>
            <div className="mb-2 text-xs">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={includeDeltaDeltaLocal}
                  onChange={(e) => setIncludeDeltaDeltaLocal(e.target.checked)}
                  className="mr-2"
                />
                Include delta-delta (2nd derivative)
              </label>
            </div>
            <div className="mb-3 text-xs">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={normalizeAugLocal}
                  onChange={(e) => setNormalizeAugLocal(e.target.checked)}
                  className="mr-2"
                />
                Per-coefficient z-score normalize augmented vectors
              </label>
            </div>

            <div className="mb-2 text-sm font-medium">Last diagnostics</div>
            <pre className="text-xs p-2 bg-white border rounded max-h-56 overflow-auto">
              {lastDiagnostics
                ? JSON.stringify(lastDiagnostics, null, 2)
                : "No diagnostics yet"}
            </pre>
            <div className="mt-2 text-xs text-gray-600">
              Changes here affect subsequent recordings. Use the sliders to tune
              DTW sensitivity and the cosine threshold to reduce false
              positives.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
