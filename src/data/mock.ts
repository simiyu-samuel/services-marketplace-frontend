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
        content: "<p>The Kenyan sun is glorious, but it can be harsh on your skin. Here are five essential tips to keep your skin glowing:</p><ul><li><strong>Hydrate, Hydrate, Hydrate:</strong> Drink plenty of water and use a hydrating serum.</li><li><strong>Sunscreen is Non-Negotiable:</strong> Use a broad-spectrum SPF of 30 or higher every single day.</li><li><strong>Gentle Cleansing:</strong> Avoid harsh soaps that strip your skin of its natural oils.</li><li><strong>Moisturize Daily:</strong> Lock in moisture with a good quality moisturizer suited for your skin type.</li><li><strong>Incorporate Antioxidants:</strong> Use products with Vitamin C to fight free radical damage.</li></ul>",
        featured_image_url: "https://images.pexels.com/photos/4046567/pexels-photo-4046567.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        category: "Skincare",
        author: { name: "Aisha Wanjiru", profile_image: "https://images.pexels.com/photos/3772510/pexels-photo-3772510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", bio: "Aisha is a certified esthetician with over 10 years of experience in skincare, focusing on tropical climates." },
        published_at: "2024-07-15",
        reading_time: 5,
    },
    {
        id: 2,
        slug: "choosing-the-right-massage",
        title: "Swedish vs. Deep Tissue: Choosing the Right Massage For You",
        excerpt: "Feeling sore or stressed? A massage can be a lifesaver, but with so many options, which one is right for you? We break down the differences between two popular types.",
        content: "<p>Deciding between a Swedish and a Deep Tissue massage depends on your goals. A <strong>Swedish massage</strong> uses long, flowing strokes and is perfect for relaxation and stress relief. On the other hand, a <strong>Deep Tissue massage</strong> uses more pressure to target deeper layers of muscle and connective tissue, making it ideal for chronic aches and pains.</p>",
        featured_image_url: "https://images.pexels.com/photos/4506269/pexels-photo-4506269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        category: "Wellness",
        author: { name: "David Otieno", profile_image: "https://images.pexels.com/photos/5327653/pexels-photo-5327653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", bio: "David is a licensed massage therapist specializing in sports and rehabilitative massage therapy." },
        published_at: "2024-07-10",
        reading_time: 4,
    },
    {
        id: 3,
        slug: "latest-nail-art-trends",
        title: "The Hottest Nail Art Trends Taking Over Nairobi",
        excerpt: "From chrome finishes to minimalist designs, Nairobi's nail scene is buzzing with creativity. Discover the top trends you need to try for your next manicure.",
        content: "<p>Nairobi's nail art scene is on fire! This season, we're seeing a lot of <strong>chrome and metallic finishes</strong>, delicate <strong>minimalist line art</strong>, and playful <strong>'mismatched mani'</strong> designs where each nail is different. Don't be afraid to experiment and express yourself!</p>",
        featured_image_url: "https://images.pexels.com/photos/3997388/pexels-photo-3997388.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        category: "Nails",
        author: { name: "Christine Moraa", profile_image: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", bio: "Christine is a professional nail technician and artist, known for her intricate and trendy designs." },
        published_at: "2024-07-05",
        reading_time: 6,
    },
    {
        id: 4,
        slug: "benefits-of-regular-facials",
        title: "Why Regular Facials are an Investment in Your Skin",
        excerpt: "Think facials are just a luxury? Think again. Regular professional facials offer a host of benefits that go beyond a simple pampering session.",
        content: "<p>Regular facials provide deep cleansing, exfoliation, and hydration that you can't achieve at home. They help to improve circulation, promote collagen production, and allow a professional to address specific skin concerns like acne, aging, or hyperpigmentation. It's a crucial part of a long-term healthy skin strategy.</p>",
        featured_image_url: "https://images.pexels.com/photos/3738348/pexels-photo-3738348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        category: "Skincare",
        author: { name: "Aisha Wanjiru", profile_image: "https://images.pexels.com/photos/3772510/pexels-photo-3772510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", bio: "Aisha is a certified esthetician with over 10 years of experience in skincare, focusing on tropical climates." },
        published_at: "2024-06-28",
        reading_time: 5,
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