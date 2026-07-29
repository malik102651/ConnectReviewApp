export const mockCompany = {
  id: 1,
  name: "Connect Realm",
  rating: 3.1,
  totalReviews: 27,
  website: "www.connectrealm.us",
  phone: "(844) 405-6904",
  email: "Support@connectrealm.us"
};

export const mockRatingDistribution = [
  { rating: 5, count: 6 },
  { rating: 4, count: 4 },
  { rating: 3, count: 3 },
  { rating: 2, count: 5 },
  { rating: 1, count: 9 }
];

export const mockReviews = [
  {
    id: 1,
    rating: 1,
    title: "The staff was just wrong",
    content: "I have never come across such a wrong and unprofessional environment where they just want your money and don't care about students. They will give you false promises and ultimately make you pay more.",
    userName: "Nancy Green",
    date: new Date("2024-03-19"),
    isVerified: 1
  },
  {
    id: 2,
    rating: 5,
    title: "Professional and Exceptional!",
    content: "Amazing institution, they provide high-quality services. The teachers and mentors are experienced and knowledgeable. I had a great experience with them.",
    userName: "Christian Angel",
    date: new Date("2024-03-18"),
    isVerified: 1
  }
];
