"use client";
import { useTheme } from "@mui/material";
import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function NotFound() {
  const theme = useTheme();

  return (
    <div className="grid h-screen place-content-center px-4">
      <div className="text-center">
        <Image
          src="/images/backgrounds/404.svg"
          alt="404"
          width={250}
          height={250}
        />
        <p className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Oops!
        </p>

        <p className="mt-4 text-slate-900">Halaman Tidak ditemukan.</p>

        <Link
          href="/"
          className="mt-6 inline-block rounded px-5 py-3 text-sm font-medium focus:outline-none focus:ring"
          style={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          Kembali
        </Link>
      </div>
    </div>
  );
}
