"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const LastModule = ({ lastModule }) => {
  return (
    <div className=" stats shadow mt-2 opacity-80 flex m-auto w-fit overflow-hidden hover:cursor-pointer">
      <div
        className="stat flex flew-row items-center justify-center"
        onClick={() => {}}
      >
        <div className="stat-figure text-primary">
          <img src="/location.png" alt="continue last module" />
        </div>
        <a href={`/lesson?topic=${lastModule}`}>
          <div className="stat-title text-sm text-secondary">
            Continue your last module: {lastModule}
          </div>
        </a>
      </div>
    </div>
  );
};
