// logic: i am creating a separate data file as a failsafe in case seeding through api doesnt work.
// this file just holds the data arrays and my seeder will import them.

////////////TESTING
// console.log('TESTING: failsafe data module loaded successfully');
////////////

export const users = [
    {
        username: 'admin',
        email: 'admin@gadgetshack.com',
        password: 'password123',
        role: 'admin'
    },
    {
        username: 'prateek',
        email: 'prateek@test.com',
        password: 'password123',
        role: 'user'
    },
    {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
    },
    {
        username: 'jane_doe',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user'
    }
];

export const products = [
    {
        name: 'UltraWide 4K Gaming Monitor',
        brand: 'LG',
        category: 'Displays',
        description: 'Immersive 34-inch curved display with 144Hz refresh rate and 1ms response time for competitive gaming.',
        price: 799.99,
        stock: 15,
        image: '/images/gamingLaptop.jpg',
        specs: { 'Resolution': '3840 x 2160', 'Refresh Rate': '144Hz', 'Panel Type': 'IPS' }
    },
    {
        name: 'Mavic Pro Cinematic Drone',
        brand: 'DJI',
        category: 'Drones',
        description: 'Professional 4K drone with omnidirectional obstacle sensing and 45-minute flight time.',
        price: 1199.99,
        stock: 5,
        image: '/images/headset.jpg',
        specs: { 'Camera': '4K at 60fps', 'Range': '15km', 'Flight Time': '45 mins' }
    },
    {
        name: 'RTX 4090 Graphics Card',
        brand: 'NVIDIA',
        category: 'Components',
        description: 'The ultimate GPU for 4K gaming and heavy 3D rendering workflows.',
        price: 1599.99,
        stock: 3,
        image: '/images/proLaptop.jpg',
        specs: { 'VRAM': '24GB GDDR6X', 'Cores': '16384', 'Boost Clock': '2.52 GHz' }
    },
    {
        name: 'Q1 Pro Mechanical Keyboard',
        brand: 'Keychron',
        category: 'Accessories',
        description: 'Customizable 75% layout mechanical keyboard with hot-swappable switches and aluminum frame.',
        price: 149.99,
        stock: 45,
        image: '/images/smartphones.jpg',
        specs: { 'Switches': 'Gateron Red', 'Layout': '75%', 'Connectivity': 'Bluetooth/Wired' }
    },
    {
        name: 'G Pro X Superlight Mouse',
        brand: 'Logitech',
        category: 'Accessories',
        description: 'Ultra-lightweight wireless esports gaming mouse weighing under 63 grams.',
        price: 129.99,
        stock: 30,
        image: '/images/speaker.jpg',
        specs: { 'Sensor': 'HERO 25K', 'Weight': '<63g', 'Battery Life': '70 hours' }
    },
    {
        name: '990 Pro 2TB NVMe SSD',
        brand: 'Samsung',
        category: 'Storage',
        description: 'Blazing fast PCIe 4.0 storage for next-gen gaming and high-end video editing.',
        price: 189.99,
        stock: 100,
        image: '/images/smartwatch.jpg',
        specs: { 'Capacity': '2TB', 'Read Speed': '7450 MB/s', 'Interface': 'PCIe 4.0 x4' }
    },
    {
        name: 'Vengeance 32GB DDR5 RAM',
        brand: 'Corsair',
        category: 'Components',
        description: 'High-frequency DDR5 memory kit optimized for the latest Intel and AMD motherboards.',
        price: 139.99,
        stock: 25,
        image: '/images/tablet.jpg',
        specs: { 'Capacity': '32GB (2x16GB)', 'Speed': '6000MHz', 'Latency': 'CL36' }
    },
    {
        name: 'Apple Watch Ultra 2',
        brand: 'Apple',
        category: 'Wearables',
        description: 'Rugged titanium smartwatch built for extreme sports and deep-sea diving.',
        price: 799.99,
        stock: 12,
        image: '/images/smartwatch.jpg',
        specs: { 'Case Material': 'Titanium', 'Water Resistance': '100m', 'Battery': 'Up to 36 hours' }
    },
    {
        name: 'Cintiq 16 Drawing Tablet',
        brand: 'Wacom',
        category: 'Tablets',
        description: 'Professional pen display tablet for digital artists and 3D sculptors.',
        price: 649.99,
        stock: 8,
        image: '/images/tablet.jpg',
        specs: { 'Screen Size': '15.6 inches', 'Pen Pressure': '8192 levels', 'Color Gamut': '72% NTSC' }
    },
    {
        name: 'SM7B Vocal Microphone',
        brand: 'Shure',
        category: 'Audio',
        description: 'Industry-standard dynamic microphone for podcasting, broadcasting, and streaming.',
        price: 399.99,
        stock: 15,
        image: '/images/tablet.jpg',
        specs: { 'Type': 'Dynamic', 'Polar Pattern': 'Cardioid', 'Connection': 'XLR' }
    },
    {
        name: 'Brio 4K Webcam',
        brand: 'Logitech',
        category: 'Accessories',
        description: 'Ultra HD webcam with HDR and Windows Hello facial recognition.',
        price: 169.99,
        stock: 20,
        image: '/images/gamingLaptop.jpg',
        specs: { 'Resolution': '4K at 30fps', 'Field of View': 'Adjustable up to 90°', 'Mic': 'Dual omni-directional' }
    },
    {
        name: 'RT-AX89X WiFi 6 Router',
        brand: 'ASUS',
        category: 'Networking',
        description: 'Dual-band WiFi 6 gaming router with dual 10G ports for ultra-fast home networking.',
        price: 349.99,
        stock: 10,
        image: '/images/headset.jpg',
        specs: { 'Standard': 'WiFi 6 (802.11ax)', 'Speed': 'Up to 6000 Mbps', 'Ports': 'Dual 10G' }
    },
    {
        name: 'PowerCore 24K Power Bank',
        brand: 'Anker',
        category: 'Accessories',
        description: 'Massive 24,000mAh portable charger with 140W fast charging capability for laptops.',
        price: 149.99,
        stock: 50,
        image: '/images/proLaptop.jpg',
        specs: { 'Capacity': '24,000mAh', 'Output': '140W Max', 'Ports': '2x USB-C, 1x USB-A' }
    },
    {
        name: 'HD60 X Capture Card',
        brand: 'Elgato',
        category: 'Streaming',
        description: 'External capture card for flawless 1080p60 streaming and 4K60 HDR passthrough.',
        price: 199.99,
        stock: 18,
        image: '/images/smartphones.jpg',
        specs: { 'Passthrough': '4K60 HDR', 'Record': '1080p60', 'Interface': 'USB 3.0' }
    },
    {
        name: 'Quest 3 VR Headset',
        brand: 'Meta',
        category: 'Gaming',
        description: 'Next-generation standalone mixed reality headset with pancake lenses and high-res color passthrough.',
        price: 499.99,
        stock: 25,
        image: '/images/speaker.jpg',
        specs: { 'Storage': '128GB', 'Display': '4K+ Infinite Display', 'Processor': 'Snapdragon XR2 Gen 2' }
    }
];

export const reviews = [
    { rating: 5, comment: 'Absolutely incredible performance. Worth every penny and completely changed my workflow.' },
    { rating: 4, comment: 'Great build quality and very fast shipping. Only giving 4 stars because the setup manual was confusing.' },
    { rating: 5, comment: 'I have tried other brands but this one takes the crown. The specs are exactly as advertised.' },
    { rating: 3, comment: 'It works fine, but I feel like it is a bit overpriced for what you actually get.' },
    { rating: 5, comment: 'Best purchase I have made all year. Highly recommend this to anyone looking to upgrade.' },
    { rating: 2, comment: 'Mine arrived with a slight scratch on the casing, and the battery life is not what was promised.' },
    { rating: 4, comment: 'Solid tech. It integrates perfectly into my current setup without any weird driver issues.' }
];