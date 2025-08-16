import { BlogPost, Review, Contact } from "@/types";

// Services, Bookings are now fetched from the API.
// Reviews endpoint is missing from the guide, so mock data is kept for now.
// Blog endpoint is missing from the guide, so mock data is kept for now.

export const mockBlogPosts: BlogPost[] = [
    {
        id: 1,
        slug: "5-skincare-tips-for-glowing-skin",
        title: "5 Skincare Tips for Glowing Skin in the Kenyan Climate",
        excerpt: "The Kenyan sun is glorious, but it can be harsh on your skin. Learn how to adapt your skincare routine to protect and nourish your skin for a radiant glow all year round.",
        content: "<p>Full blog content goes here...</p>",
        featured_image_url: "/placeholder.svg",
        category: "Skincare",
        author: { name: "Aisha Wanjiru", profile_image: "/placeholder.svg" },
        published_at: "2024-07-15",
        reading_time: 5,
    },
    {
        id: 2,
        slug: "choosing-the-right-massage",
        title: "Swedish vs. Deep Tissue: Choosing the Right Massage For You",
        excerpt: "Feeling sore or stressed? A massage can be a lifesaver, but with so many options, which one is right for you? We break down the differences between two popular types.",
        content: "<p>Full blog content goes here...</p>",
        featured_image_url: "/placeholder.svg",
        category: "Wellness",
        author: { name: "David Otieno", profile_image: "/placeholder.svg" },
        published_at: "2024-07-10",
        reading_time: 4,
    },
    {
        id: 3,
        slug: "latest-nail-art-trends",
        title: "The Hottest Nail Art Trends Taking Over Nairobi",
        excerpt: "From chrome finishes to minimalist designs, Nairobi's nail scene is buzzing with creativity. Discover the top trends you need to try for your next manicure.",
        content: "<p>Full blog content goes here...</p>",
        featured_image_url: "/placeholder.svg",
        category: "Nails",
        author: { name: "Christine Moraa", profile_image: "/placeholder.svg" },
        published_at: "2024-07-05",
        reading_time: 6,
    }
];

export const mockReviews: Review[] = [
  {
    id: 1,
    sellerId: 101,
    rating: 5,
    comment: "Absolutely amazing service! My nails have never looked better. The attention to detail was incredible. Will definitely be back!",
    created_at: "2024-07-20",
    customer: { name: "Alice J.", profile_image: "/placeholder.svg" },
  },
  {
    id: 2,
    sellerId: 101,
    rating: 4,
    comment: "Great experience, very professional and clean environment. My gel polish lasted for almost 3 weeks without chipping.",
    created_at: "2024-07-18",
    customer: { name: "Brenda C.", profile_image: "/placeholder.svg" },
  },
  {
    id: 3,
    sellerId: 102,
    rating: 5,
    comment: "The deep tissue massage was exactly what I needed. The therapist was very skilled and attentive to my problem areas. Felt like a new person afterwards.",
    created_at: "2024-07-15",
    customer: { name: "David O.", profile_image: "/placeholder.svg" },
  },
];

export const mockContacts: Contact[] = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    subject: "Question about booking",
    message: "Hello, I was wondering if it's possible to book a service for a group of 4 people. We are interested in the manicure service next Saturday. Thank you!",
    status: 'unread',
    created_at: "2024-07-28T10:00:00Z",
    updated_at: "2024-07-28T10:00:00Z",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john.smith@example.com",
    subject: "Partnership Inquiry",
    message: "Hi Themabinti team, I represent a local beauty products supplier and I would love to discuss a potential partnership with your platform. Who would be the best person to talk to?",
    status: 'read',
    created_at: "2024-07-27T14:30:00Z",
    updated_at: "2024-07-27T16:00:00Z",
  },
  {
    id: 3,
    name: "Emily White",
    email: "emily.white@example.com",
    subject: "Feedback on my last appointment",
    message: "I just wanted to say I had a wonderful experience with one of your sellers, 'Nairobi Nails'. The service was exceptional and I will definitely be using your platform again.",
    status: 'responded',
    admin_response: "Thank you so much for your kind words, Emily! We're thrilled to hear you had a great experience and we've passed your feedback on to the seller.",
    created_at: "2024-07-26T09:15:00Z",
    updated_at: "2024-07-26T11:00:00Z",
  }
];