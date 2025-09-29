"use client"
import { useState } from "react"
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"
import OrganicBadge from "@/assets/images/organic-badge.png"
import Button from "../ui/Button"

// Example image list
import bg1 from "@/assets/images/herobg.jpg"
import bg2 from "@/assets/images/bg2.jpg"
import bg3 from "@/assets/images/bg3.jpg"
import { Link } from "react-router-dom"
const images = [bg1, bg2, bg3]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/30" /> {/* overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-screen">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-2xl md:text-3xl lg:text-7xl font-extrabold text-white leading-tight mb-8 drop-shadow-lg">
              FIND NATURAL
              <br />
              AND ORGANIC
              <br />
              PRODUCTS
            </h1>

            {/* Buttons */}
           <div className="flex flex-col md:flex-row gap-4">
  {/* View Products Button */}
  <button className="group flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-semibold
                     bg-transparent text-white border border-yellow-200
                     hover:bg-yellow-200 hover:text-black hover:border-yellow-200
                     transition-colors duration-300">
    <span className="flex items-center gap-2">
      <ArrowUpRight className="w-5 h-5 font-bold transition-all duration-300 group-hover:order-first group-hover:mr-2" />
      View Our Products
    </span>
  </button>

  {/* Check Rice Crop Yield Button */}
  <Link to="/predict">
  <button className="group flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-semibold
                     bg-green-200 text-black border border-green-200
                     hover:bg-transparent hover:text-white hover:border-green-200
                     transition-colors duration-300">
    <span className="flex items-center gap-2">
      Predict Your Rice Yield
      <ArrowUpRight className="w-5 h-5 font-bold transition-all duration-300 group-hover:order-first group-hover:mr-2" />
    </span>
  </button>
  </Link>
</div>

          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-20">
        <button
          onClick={prevSlide}
          className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Organic Badge */}
      <img
        src={OrganicBadge}
        alt="Organic Badge"
        className="absolute bottom-1 right-40 w-36 h-30 z-20"
      />

      {/* Wavy Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-32 fill-white"
          preserveAspectRatio="none"
        >
          <path d="M0,224 C360,96 1080,352 1440,224 L1440,320 L0,320 Z" />
        </svg>
      </div>
    </section>
  )
}
