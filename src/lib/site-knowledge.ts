// Static knowledge base describing every publicly-accessible (non-admin) page
// on the Notarc website. This is fed into the chatbot's system prompt so it
// can answer questions about site content, navigation, and policies accurately.
//
// NOTE: this file is a hand-maintained summary of page copy. If page text is
// edited significantly, this file should be updated to match, or the chatbot
// will describe outdated content.

export const SITE_KNOWLEDGE = `
=== ABOUT NOTARC ===
NOTARC (National Object and Transport Automation with Research Center) is a drone and robotics startup based in Bengaluru, Karnataka, India. Their vision is to be India's leading hub for drone innovation and practical tech education, empowering creators to imagine, build, and fly their future. They specialize in custom-built drones, AI-integrated prototypes, and tech solutions for individuals, institutions, and industries.

Notarc was founded in 2023

=== HOME PAGE (/) ===
Sections in order:
1. Hero: headline "notarc", tagline "Unleashing Innovation: Drones, Robotics, and Beyond!" with buttons to explore products/courses.
2. Our Vision: company mission statement (see About Notarc above).
3. Core Offerings — six services offered:
   - Drone Solutions: aerial surveying, inspections, banner hoisting, creative drone applications, industry-focused drone services.
   - Tech Workshops & Training: hands-on workshops in drones, robotics, RC cars, 3D printing, and programming for all age groups.
   - Prototyping & 3D Printing: rapid prototyping and precision 3D printing for education, research, and product development.
   - FPV Solutions: modern websites, web applications, UI/UX design, digital platforms.
   - Engineering & Project Consulting: expert guidance for drone, robotics, engineering, and technology projects from concept to completion.
   - Aerial Videography & Photography: custom RC vehicles, robotics systems, upgrades, repairs, specialized educational builds.
4. Products preview: a sample of products from the store (see live PRODUCT CATALOG data below for the full current list).
5. Gallery: photos from workshops, projects, and innovations.
6. Trusted By: client/partner logos including COMEDKARES, SJCIT, MCE, Inunity, Poornaprajna, MERIIISE, PESCE, RRCE, SKIT, Thomas School, RNSIT, and KSIT — mostly engineering colleges and institutions Notarc has worked with.
7. Testimonials: Google reviews widget showing customer reviews and star rating.

=== PRODUCTS PAGE (/products) ===
Heading: "Professional Drone & Robotics Equipment". Lets visitors browse, search, and filter the full product catalog by category, with sorting options. See live PRODUCT CATALOG data below for actual current products, prices, and categories. Each product has its own detail page at /products/[slug] with full description and images. Visitors can add items to their cart from here (requires login to add to cart).

=== COURSES PAGE (/courses) ===
Heading: "Explore, Experience, and Expand". Description: drone, robotics, and technology courses with hands-on, real-time workshops. See live COURSE CATALOG data below for actual current courses, levels, and durations. Each course has its own detail page at /courses/[slug]. Logged-in students can enroll in courses; enrolled courses appear on the "My Courses" page.

=== CONTACT US PAGE (/contact-us) ===
Heading: "Let's Build Something Amazing". For inquiries about drone solutions, robotics training, workshops, engineering consultation, or custom projects.
Contact details:
- Address: 57, Chimney Hills Bangalore Hesaraghatta Main Road, Post, Chikkabanavara, Bengaluru, Karnataka 560090
- Phone: +91 79757 82830
- Email: info@notarc.in
- Working Hours: Monday – Saturday, 9:00 AM – 6:00 PM
The page includes a contact form, a map, and a FAQ section:
- "Do you conduct drone workshops for colleges?" — Yes, they organize workshops, bootcamps, and hands-on training programs for schools, colleges, and organizations.
- "Can you build custom drone solutions?" — Yes, they design and develop custom drone and robotics solutions based on requirements.
- "Do you provide technical consultation?" — Yes, they assist with product development, prototyping, research projects, and engineering consultation.
- "How soon will I receive a reply?" — They aim to respond to all enquiries within one business day.

=== CART PAGE (/cart) ===
Shows items the visitor has added to their cart, with quantities and totals. Shows "Your cart is empty" if nothing has been added. Proceeds to checkout from here.

=== CHECKOUT PAGE (/checkout) ===
Where logged-in visitors complete their purchase after reviewing their cart.

=== ORDER SUCCESS PAGE (/order-success) ===
Confirmation page shown after a successful order ("Order Placed!").

=== LOGIN PAGE (/login) AND SIGNUP PAGE (/signup) ===
Standard account login and account creation forms. An account is required to add items to cart, enroll in courses, and view order/enrollment history.

=== MY ORDERS PAGE (/my-orders) ===
Logged-in visitors can view their past product orders and order status here.

=== MY COURSES PAGE (/my-courses) ===
Logged-in visitors can view courses they're enrolled in here, and can request disenrollment from a course if needed (subject to admin approval).

=== PROFILE PAGE (/profile) ===
Logged-in visitors can view and edit their account details here.

=== NAVIGATION ===
The main navigation bar includes: Home, Explore Products, Book a Course, Contact Us, Cart, and Login/Signup (or account menu if logged in).
`;