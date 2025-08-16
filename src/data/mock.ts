import { Service } from "@/types";

export const mockServices: Service[] = [
  {
    id: 1,
    title: "Luxury Manicure & Pedicure",
    category: "Nails",
    price: 3500,
    duration: 90,
    location: "Nairobi",
    is_mobile: true,
    rating: 4.9,
    review_count: 128,
    seller: {
      id: 101,
      name: "Glamour Nails",
      profile_image_url: "/placeholder.svg",
    },
    media: [
      { id: 1, url: "/placeholder.svg", type: "image" },
      { id: 2, url: "/placeholder.svg", type: "image" },
    ],
  },
  {
    id: 2,
    title: "Deep Tissue Massage",
    category: "Wellness",
    price: 5000,
    duration: 60,
    location: "Mombasa",
    is_mobile: false,
    rating: 4.8,
    review_count: 95,
    seller: {
      id: 102,
      name: "Serenity Spa",
      profile_image_url: "/placeholder.svg",
    },
    media: [
        { id: 3, url: "/placeholder.svg", type: "image" },
    ],
  },
  {
    id: 3,
    title: "Bridal Makeup Package",
    category: "Makeup",
    price: 15000,
    duration: 180,
    location: "Nairobi",
    is_mobile: true,
    rating: 5.0,
    review_count: 76,
    seller: {
      id: 103,
      name: "Faces by Jane",
      profile_image_url: "/placeholder.svg",
    },
    media: [
        { id: 4, url: "/placeholder.svg", type: "image" },
        { id: 5, url: "/placeholder.svg", type: "image" },
        { id: 6, url: "/placeholder.svg", type: "image" },
    ],
  },
  {
    id: 4,
    title: "Professional Hair Braiding",
    category: "Hair",
    price: 4000,
    duration: 240,
    location: "Kisumu",
    is_mobile: false,
    rating: 4.7,
    review_count: 210,
    seller: {
      id: 104,
      name: "Knotless Queens",
      profile_image_url: "/placeholder.svg",
    },
    media: [
        { id: 7, url: "/placeholder.svg", type: "image" },
    ],
  },
];