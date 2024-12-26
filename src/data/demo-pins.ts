export const demoUsers = {
  johnDoe: {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "John Doe",
    username: "johndoe",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    bio: "Photography enthusiast and digital creator",
  },
  janeSmith: {
    id: "987fcdeb-51a2-43d7-9b56-626614174001",
    name: "Jane Smith",
    username: "janesmith",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    bio: "Creative director and visual storyteller",
  },
  coffeeCo: {
    id: "456e7890-f12d-34e5-b678-901234567890",
    name: "Coffee Co.",
    username: "coffeeco",
    avatar: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    bio: "Premium coffee experiences",
  }
};

export const demoData = [
  {
    id: "1",
    title: "Beautiful Workspace",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    description: "A clean and minimal workspace setup",
    creator: demoUsers.janeSmith,
    likes: 2,
    comments: [
      {
        id: "c1",
        user: demoUsers.johnDoe,
        content: "Love the minimalist approach!",
        created_at: new Date().toISOString(),
      }
    ],
    hasLiked: true
  },
  {
    id: "2",
    title: "Premium Coffee Experience",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    description: "Start your day with premium coffee",
    creator: demoUsers.coffeeCo,
    isAd: true,
    advertiser: "Coffee Co.",
    likes: 1,
    comments: [],
    hasLiked: false
  },
  {
    id: "3",
    title: "Modern Development",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    description: "Modern software development workspace",
    creator: demoUsers.johnDoe,
    likes: 1,
    comments: [],
    hasLiked: true
  },
  {
    id: "4",
    title: "Urban Photography",
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
    description: "City life captured in stunning detail",
    creator: demoUsers.janeSmith,
    likes: 1,
    comments: [],
    hasLiked: false
  },
  {
    id: "5",
    title: "Cozy Reading Corner",
    imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91",
    description: "Perfect spot for a relaxing afternoon",
    creator: demoUsers.janeSmith,
    likes: 3,
    comments: [],
    hasLiked: false
  },
  {
    id: "6",
    title: "Mountain Adventure",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    description: "Breathtaking views from the summit",
    creator: demoUsers.johnDoe,
    likes: 5,
    comments: [],
    hasLiked: false
  }
].map(pin => ({
  ...pin,
  creator: pin.creator || demoUsers.johnDoe
}));