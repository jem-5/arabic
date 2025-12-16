export default async function getUserMediaCompat(
  constraints = { audio: true }
) {
  if (typeof navigator === "undefined") {
    throw new Error("navigator is undefined");
  }
  // Standard modern API
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return await navigator.mediaDevices.getUserMedia(constraints);
  }

  // Legacy vendor-prefixed API
  const legacy =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
  if (legacy) {
    return await new Promise((resolve, reject) =>
      legacy.call(navigator, constraints, resolve, reject)
    );
  }

  throw new Error("getUserMedia is not supported in this browser");
}
