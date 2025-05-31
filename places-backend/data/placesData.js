const places = [
  {
    id: 1,
    name: "Taj Mahal",
    location: "Agra, Uttar Pradesh",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description:
      "An ivory-white marble mausoleum on the right bank of the Yamuna river. A UNESCO World Heritage Site and one of the Seven Wonders of the World.",
  },
  {
    id: 2,
    name: "Gateway of India",
    location: "Mumbai, Maharashtra",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description:
      "An iconic arch-monument built in the early 20th century in Mumbai, symbolizing the British Raj's arrival and departure.",
  },
  {
    id: 3,
    name: "Qutub Minar",
    location: "Delhi",
    image:
      "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description:
      "A 73-meter tall tapering tower of five storeys, built in 1192. A symbol of Indo-Islamic Afghan architecture.",
  },
  {
    id: 4,
    name: "Mysore Palace",
    location: "Mysore, Karnataka",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description:
      "A historic palace and royal residence that exemplifies Indo-Saracenic architecture, illuminated at night with thousands of lights.",
  },
  {
    id: 5,
    name: "Hawa Mahal",
    location: "Jaipur, Rajasthan",
    image:
      "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description:
      "Also known as the 'Palace of Winds', built with red and pink sandstone to allow royal ladies to observe street festivals unseen.",
  },
  {
    id: 6,
    name: "Charminar",
    location: "Hyderabad, Telangana",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description:
      "A historic monument and mosque built in 1591, known for its four grand arches and bustling surrounding markets.",
  },
  {
    id: 7,
    name: "Golden Temple",
    location: "Amritsar, Punjab",
    image:
      "https://images.unsplash.com/photo-1601823984263-b87b59798b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description:
      "The holiest Gurdwara of Sikhism, known for its stunning golden architecture and spiritual serenity.",
  },
  {
    id: 8,
    name: "Sun Temple",
    location: "Konark, Odisha",
    image:
      "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description:
      "A 13th-century temple shaped like a giant chariot dedicated to the Sun God, Surya. A UNESCO World Heritage Site.",
  },
  {
    id: 9,
    name: "Backwaters of Kerala",
    location: "Alleppey, Kerala",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description:
      "A unique ecosystem of interconnected canals, rivers, and lakes famous for houseboat cruises and lush greenery.",
  },
  {
    id: 10,
    name: "Victoria Memorial",
    location: "Kolkata, West Bengal",
    image:
      "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description:
      "A large marble building built in memory of Queen Victoria, showcasing Indo-Saracenic architecture and British colonial heritage.",
  },
  {
    id: 11,
    name: "Taj Mahal",
    location: "Agra, Uttar Pradesh",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description:
      "An ivory-white marble mausoleum on the right bank of the Yamuna river. A UNESCO World Heritage Site and one of the Seven Wonders of the World.",
  },
  {
    id: 12,
    name: "Gateway of India",
    location: "Mumbai, Maharashtra",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description:
      "An iconic arch-monument built in the early 20th century in Mumbai, symbolizing the British Raj's arrival and departure.",
  },
  {
    id: 13,
    name: "Qutub Minar",
    location: "Delhi",
    image:
      "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description:
      "A 73-meter tall tapering tower of five storeys, built in 1192. A symbol of Indo-Islamic Afghan architecture.",
  },
  {
    id: 14,
    name: "Mysore Palace",
    location: "Mysore, Karnataka",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description:
      "A historic palace and royal residence that exemplifies Indo-Saracenic architecture, illuminated at night with thousands of lights.",
  },
  {
    id: 15,
    name: "Hawa Mahal",
    location: "Jaipur, Rajasthan",
    image:
      "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description:
      "Also known as the 'Palace of Winds', built with red and pink sandstone to allow royal ladies to observe street festivals unseen.",
  },
  {
    id: 16,
    name: "Charminar",
    location: "Hyderabad, Telangana",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description:
      "A historic monument and mosque built in 1591, known for its four grand arches and bustling surrounding markets.",
  },
  {
    id: 17,
    name: "Golden Temple",
    location: "Amritsar, Punjab",
    image:
      "https://images.unsplash.com/photo-1601823984263-b87b59798b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description:
      "The holiest Gurdwara of Sikhism, known for its stunning golden architecture and spiritual serenity.",
  },
  {
    id: 18,
    name: "Sun Temple",
    location: "Konark, Odisha",
    image:
      "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description:
      "A 13th-century temple shaped like a giant chariot dedicated to the Sun God, Surya. A UNESCO World Heritage Site.",
  },
  {
    id: 19,
    name: "Backwaters of Kerala",
    location: "Alleppey, Kerala",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description:
      "A unique ecosystem of interconnected canals, rivers, and lakes famous for houseboat cruises and lush greenery.",
  },
  {
    id: 20,
    name: "Victoria Memorial",
    location: "Kolkata, West Bengal",
    image:
      "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description:
      "A large marble building built in memory of Queen Victoria, showcasing Indo-Saracenic architecture and British colonial heritage.",
  },
  {
    id: 21,
    name: "Victoria Memorial",
    location: "Kolkata, West Bengal",
    image:
      "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description:
      "A large marble building built in memory of Queen Victoria, showcasing Indo-Saracenic architecture and British colonial heritage.",
  },
];

module.exports = places;
