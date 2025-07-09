const places = [
  {
    id: 1,
    name: "Taj Mahal",
    location: "Agra, Uttar Pradesh",
    category: "Monument",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?...",
    description:
      "An ivory-white marble mausoleum on the right bank of the Yamuna river. A UNESCO World Heritage Site and one of the Seven Wonders of the World.",
  },
  {
    id: 2,
    name: "Gateway of India",
    location: "Mumbai, Maharashtra",
    category: "Monument",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?...",
    description:
      "An iconic arch-monument built in the early 20th century in Mumbai, symbolizing the British Raj's arrival and departure.",
  },
  {
    id: 3,
    name: "Qutub Minar",
    location: "Delhi",
    category: "Monument",
    image:
      "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?...",
    description:
      "A 73-meter tall tapering tower of five storeys, built in 1192. A symbol of Indo-Islamic Afghan architecture.",
  },
  {
    id: 4,
    name: "Mysore Palace",
    location: "Mysore, Karnataka",
    category: "Palace",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?...",
    description:
      "A historic palace and royal residence that exemplifies Indo-Saracenic architecture, illuminated at night with thousands of lights.",
  },
  {
    id: 5,
    name: "Hawa Mahal",
    location: "Jaipur, Rajasthan",
    category: "Palace",
    image:
      "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?...",
    description:
      "Also known as the 'Palace of Winds', built with red and pink sandstone to allow royal ladies to observe street festivals unseen.",
  },
  {
    id: 6,
    name: "Charminar",
    location: "Hyderabad, Telangana",
    category: "Monument",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?...",
    description:
      "A historic monument and mosque built in 1591, known for its four grand arches and bustling surrounding markets.",
  },
  {
    id: 7,
    name: "Golden Temple",
    location: "Amritsar, Punjab",
    category: "Religious Site",
    image: "https://images.unsplash.com/photo-1601823984263-b87b59798b70?...",
    description:
      "The holiest Gurdwara of Sikhism, known for its stunning golden architecture and spiritual serenity.",
  },
  {
    id: 8,
    name: "Sun Temple",
    location: "Konark, Odisha",
    category: "Religious Site",
    image:
      "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?...",
    description:
      "A 13th-century temple shaped like a giant chariot dedicated to the Sun God, Surya. A UNESCO World Heritage Site.",
  },
  {
    id: 9,
    name: "Backwaters of Kerala",
    location: "Alleppey, Kerala",
    category: "Natural",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?...",
    description:
      "A unique ecosystem of interconnected canals, rivers, and lakes famous for houseboat cruises and lush greenery.",
  },
  {
    id: 10,
    name: "Victoria Memorial",
    location: "Kolkata, West Bengal",
    category: "Monument",
    image:
      "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?...",
    description:
      "A large marble building built in memory of Queen Victoria, showcasing Indo-Saracenic architecture and British colonial heritage.",
  },
  // Entries 11 to 21 are duplicates — add categories accordingly:
  {
    id: 11,
    name: "Taj Mahal",
    location: "Agra, Uttar Pradesh",
    category: "Monument",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?...",
    description:
      "An ivory-white marble mausoleum on the right bank of the Yamuna river. A UNESCO World Heritage Site and one of the Seven Wonders of the World.",
  },
  {
    id: 12,
    name: "Gateway of India",
    location: "Mumbai, Maharashtra",
    category: "Monument",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?...",
    description:
      "An iconic arch-monument built in the early 20th century in Mumbai, symbolizing the British Raj's arrival and departure.",
  },
  {
    id: 13,
    name: "Qutub Minar",
    location: "Delhi",
    category: "Monument",
    image:
      "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?...",
    description:
      "A 73-meter tall tapering tower of five storeys, built in 1192. A symbol of Indo-Islamic Afghan architecture.",
  },
  {
    id: 14,
    name: "Mysore Palace",
    location: "Mysore, Karnataka",
    category: "Palace",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?...",
    description:
      "A historic palace and royal residence that exemplifies Indo-Saracenic architecture, illuminated at night with thousands of lights.",
  },
  {
    id: 15,
    name: "Hawa Mahal",
    location: "Jaipur, Rajasthan",
    category: "Palace",
    image:
      "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?...",
    description:
      "Also known as the 'Palace of Winds', built with red and pink sandstone to allow royal ladies to observe street festivals unseen.",
  },
  {
    id: 16,
    name: "Charminar",
    location: "Hyderabad, Telangana",
    category: "Monument",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?...",
    description:
      "A historic monument and mosque built in 1591, known for its four grand arches and bustling surrounding markets.",
  },
  {
    id: 17,
    name: "Golden Temple",
    location: "Amritsar, Punjab",
    category: "Religious Site",
    image: "https://images.unsplash.com/photo-1601823984263-b87b59798b70?...",
    description:
      "The holiest Gurdwara of Sikhism, known for its stunning golden architecture and spiritual serenity.",
  },
  {
    id: 18,
    name: "Sun Temple",
    location: "Konark, Odisha",
    category: "Religious Site",
    image:
      "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?...",
    description:
      "A 13th-century temple shaped like a giant chariot dedicated to the Sun God, Surya. A UNESCO World Heritage Site.",
  },
  {
    id: 19,
    name: "Backwaters of Kerala",
    location: "Alleppey, Kerala",
    category: "Natural",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?...",
    description:
      "A unique ecosystem of interconnected canals, rivers, and lakes famous for houseboat cruises and lush greenery.",
  },
  {
    id: 20,
    name: "Victoria Memorial",
    location: "Kolkata, West Bengal",
    category: "Monument",
    image:
      "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?...",
    description:
      "A large marble building built in memory of Queen Victoria, showcasing Indo-Saracenic architecture and British colonial heritage.",
  },
  {
    id: 21,
    name: "Victoria Memorial",
    location: "Kolkata, West Bengal",
    category: "Monument",
    image:
      "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?...",
    description:
      "A large marble building built in memory of Queen Victoria, showcasing Indo-Saracenic architecture and British colonial heritage.",
  },
  {
    id: 22,
    name: "Meenakshi Temple",
    location: "Madurai, Tamil Nadu",
    category: "Religious Site",
    image:
      "https://images.unsplash.com/photo-1604922528359-b2c8885dc999?auto=format&fit=crop&w=1200&q=80",
    description:
      "A historic Hindu temple dedicated to Goddess Meenakshi and Lord Sundareswarar, known for its stunning towers and intricate sculptures.",
  },
  {
    id: 23,
    name: "Ranthambore National Park",
    location: "Sawai Madhopur, Rajasthan",
    category: "Wildlife",
    image:
      "https://images.unsplash.com/photo-1581167761641-0b40ecb6c3cd?auto=format&fit=crop&w=1200&q=80",
    description:
      "A vast wildlife reserve famed for its Bengal tigers, ancient ruins, and scenic landscapes.",
  },
  {
    id: 24,
    name: "Andaman Islands",
    location: "Andaman and Nicobar Islands",
    category: "Natural",
    image:
      "https://images.unsplash.com/photo-1622459566022-43f48d169cc5?auto=format&fit=crop&w=1200&q=80",
    description:
      "A tropical paradise of white-sand beaches, coral reefs, and marine life perfect for diving and snorkeling.",
  },
  {
    id: 25,
    name: "Rani ki Vav",
    location: "Patan, Gujarat",
    category: "Monument",
    image:
      "https://images.unsplash.com/photo-1609424618657-39d06c648e4e?auto=format&fit=crop&w=1200&q=80",
    description:
      "An intricately carved stepwell and UNESCO World Heritage Site built in the 11th century.",
  },
  {
    id: 26,
    name: "Valley of Flowers",
    location: "Chamoli, Uttarakhand",
    category: "Natural",
    image:
      "https://images.unsplash.com/photo-1693664711677-fb6cdaf6a938?auto=format&fit=crop&w=1200&q=80",
    description:
      "A scenic national park nestled in the Himalayas, famous for its alpine flowers and rare wildlife.",
  },
  {
    id: 27,
    name: "Ellora Caves",
    location: "Aurangabad, Maharashtra",
    category: "Monument",
    image:
      "https://images.unsplash.com/photo-1600705290060-f1f65c2755c4?auto=format&fit=crop&w=1200&q=80",
    description:
      "A rock-cut complex of Buddhist, Hindu, and Jain temples, featuring the majestic Kailasa temple carved from a single rock.",
  },
  {
    id: 28,
    name: "Sanchi Stupa",
    location: "Sanchi, Madhya Pradesh",
    category: "Religious Site",
    image:
      "https://images.unsplash.com/photo-1609924784826-6b2c1f2e2320?auto=format&fit=crop&w=1200&q=80",
    description:
      "An ancient Buddhist monument commissioned by Emperor Ashoka, known for its dome structure and intricately carved gateways.",
  },
  {
    id: 29,
    name: "Auroville",
    location: "Pondicherry",
    category: "Spiritual Retreat",
    image:
      "https://images.unsplash.com/photo-1623133537820-7b59cd75f240?auto=format&fit=crop&w=1200&q=80",
    description:
      "An experimental township built for human unity, featuring the golden Matrimandir at its heart.",
  },
  {
    id: 30,
    name: "Dholavira",
    location: "Kutch, Gujarat",
    category: "Historic Site",
    image:
      "https://images.unsplash.com/photo-1675464130862-dbe727607a9b?auto=format&fit=crop&w=1200&q=80",
    description:
      "A prominent city of the Indus Valley Civilization with an advanced urban planning system, now a UNESCO World Heritage Site.",
  },
  {
    id: 31,
    name: "Chilika Lake",
    location: "Odisha",
    category: "Natural",
    image:
      "https://images.unsplash.com/photo-1613414440385-f1ea4b72663a?auto=format&fit=crop&w=1200&q=80",
    description:
      "Asia's largest brackish water lagoon, home to migratory birds, dolphins, and fishing villages.",
  },
];

export default places;
