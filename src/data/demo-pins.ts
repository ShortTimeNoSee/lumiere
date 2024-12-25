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
    creator: demoUsers.johnDoe,
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
  }
].map(pin => ({
  ...pin,
  creator: pin.creator || demoUsers.johnDoe
}));