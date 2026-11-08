/* js/data.js — YOUR CONTENT: marquee phrases, projects and reviews.
   Add a project: copy one block inside PROJECTS. Add a review: copy one line inside REVIEWS. */
window.PF = window.PF || {};
PF.content = (() => {
// Marquee phrases: keep an even number of items. Short, specific, outcome-focused.
const MARQUEE = ["fast websites that rank", "clean code that scales", "wordpress to full-stack", "top rated on upwork", "built to last", "let’s build yours"];
// Projects shown in "Our Work". url "#" shows "Live link coming soon". frame:false = image has its own transparent background.
const PROJECTS = [
  { title:"Dream Records", type:"SaaS platform", subtitle:"Music Distribution & Royalty Management SaaS Platform",
    about:"A comprehensive platform where music labels manage artist submissions, releases, streaming analytics, royalty tracking and payments from one centralized dashboard. Built as a commercial SaaS, it is provided to labels on a recurring monthly service model.",
    features:["Music submission and release management","Distribution workflow for Spotify and Apple Music","Streaming analytics and revenue tracking","Royalty, balance and payment management","Excel-based analytics report processing","Artist and label management","Centralized dashboard and data management"],
    role:"Full-Stack Development, Backend Development, Database Management, API Integration",
    stack:["React.js","Node.js","Express.js","MongoDB","REST APIs","AWS S3"],
    url:"#", image:"images/dream-records.webp", size:[1000,643], tint:"#F0535B", frame:false },
  { title:"KGZ Graphics", type:"WordPress website", subtitle:"Professional WordPress Website Development",
    about:"A professional, responsive WordPress website built on an existing theme and plugins, enhanced with custom code to achieve the required design and functionality. The focus was a clean visual experience, better usability and layouts that match the brand’s identity.",
    features:["WordPress website development","Theme and plugin configuration","Elementor-based page building","Custom CSS, JavaScript and PHP enhancements","Responsive design implementation","Website functionality customization","UI and performance improvements"],
    role:"WordPress Development, Website Customization, Responsive Design",
    stack:["WordPress","Elementor","HTML5","CSS3","JavaScript","PHP"],
    url:"https://demo-site.kgzgraphics.com/", image:"images/kgz-graphics.webp", size:[1000,638], tint:"#F28C28" },
  { title:"Thrive Global", type:"WordPress website", subtitle:"Corporate & Event Website Development",
    about:"A professional corporate and event website built with WordPress, using an existing theme and plugins with custom code enhancements for the required design and functionality. The focus was a polished user experience, responsive layouts and an effective way to present the brand and its events.",
    features:["WordPress website development","Theme and plugin customization","Elementor page building","Custom CSS, JavaScript and PHP enhancements","Responsive layout implementation","Website functionality enhancements","UI and user experience improvements"],
    role:"WordPress Development, Website Customization, UI Implementation",
    stack:["WordPress","Elementor","HTML5","CSS3","JavaScript","PHP"],
    url:"https://thriveglobalforum.com/", image:"images/thrive-global.webp", size:[1000,564], tint:"#2F7D32" }
];
// Upwork reviews, copied as written. Client names are intentionally hidden. (Two jobs with no written review are not listed.)
const REVIEWS = [
  { text:"Mehedi did an excellent job providing website support and development services for us. He was professional, reliable, responsive, and knowledgeable. His technical skills and dedication made a real difference. We highly recommend Mehedi to anyone looking for quality website support and development!", author:"Upwork client", job:"Website Support and Developer", rating:5 },
  { text:"Excellent developer to work with! He understood the requirements very well, communicated clearly, and delivered the project professionally and on time. He was responsive, technically skilled, and willing to make adjustments whenever needed. I’m very satisfied with the quality of his work and would definitely recommend him to anyone looking for a reliable and professional developer. Looking forward to working with him again on future projects.", author:"Upwork client", job:"Full-Stack Developer for Advanced Data Analytics & Scalable Web Platform (React, Node, MongoDB)", rating:5 },
  { text:"Mehedi is extremely talented, a great communicator and most of all a trustworthy freelance partner. I will use him again and highly recommend him. I will be rehiring him...", author:"Upwork client", job:"Website design", rating:5 },
  { text:"Great experience in working with Mehedi. He is very good.", author:"Upwork client", job:"Rearrange list of services on a website", rating:5 },
  { text:"Very happy with work, quick and efficient.", author:"Upwork client", job:"Animated cards in Elementor with glowing mouse hover effect", rating:5 },
  { text:"Mehedi jumped right in and took a ton of initiative to get my most urgent need fixed right away. He was capable and extremely fair with his pricing. I will be using him again soon for my next stage project and would highly recommend him to anyone.", author:"Upwork client", job:"Update wordpress site and fix some issues with iconography and software bugs", rating:5 },
  { text:"I hired Mehedi for a website design project, and he did a great job. He was responsive, easy to communicate with, and delivered exactly what I was looking for. The design was clean, modern, and aligned well with my vision. He also completed the work on time and was open to feedback throughout the process. I’d definitely recommend Mehedi for anyone looking for quality web design work.", author:"Upwork client", job:"Web design and development", rating:5 },
  { text:"I was facing complex issues integrating Braintree and customizing our website’s registration form—tasks that many developers either couldn’t handle or weren’t willing to fully commit to. After consulting with several freelancers, it was clear that Hasan was different. He not only took on the challenge, but approached it with genuine interest, deep technical insight, and an exceptional problem-solving mindset. Hasan went above and beyond—conducting thorough research, proposing smart and scalable solutions, and ultimately delivering results that far exceeded our expectations. His work was not only technically sound, but also clean, efficient, and well-documented, which made future updates a breeze. What really sets Hasan apart is his unwavering dedication, consistent communication, and professionalism. He’s always available, quick to respond, and incredibly easy to work with. He shows real ownership of the projects he takes on, and his commitment to client satisfaction is rare to find. I’ve worked with many freelancers on this platform, but none match Hasan’s level of excellence. He’s a true asset to any team, and I would recommend him without hesitation—any day, any time.", author:"Upwork client", job:"Braintree and payment integration", rating:5 },
  { text:"Great experience working with Mehedi. Very professional, delivered on time, and met all my requirements. Highly recommended!", author:"Upwork client", job:"Full-Stack Developer (React.js, Node.js, WordPress, Elementor Expert)", rating:5 },
  { text:"Good website designer & developer. Technically savvy. Thank you!", author:"Upwork client", job:"Port my GoDaddy Website to WordPress", rating:5 },
  { text:"Mehedi is a very competent developer. I would recommend anyone wanting a Full Stack Developer. He goes beyond the requirements to get the project over the land.", author:"Upwork client", job:"Full Stack Developer Needed for Building User and Admin Dashboards with React, Node, MongoDB", rating:5 },
  { text:"Mehedi did a Good Job. I really appreciate it. The first step of the project is over. Will hire soon for the next step.", author:"Upwork client", job:"Full Stack Developer Needed for Building User and Admin Dashboards with React, Node, MongoDB", rating:5 },
  { text:"I am very happy to work with Mehedi. He is very fast. Completed the job successfully within 24 hours. I look forward to working with him more in the future.", author:"Upwork client", job:"React, node, full-stack developer, frontend, backend, etc", rating:5 },
  { text:"It was great working with Mehdi. He solved my problem and my website is now loading really fast, which is what I needed. He is also very responsive and responds very quickly.", author:"Upwork client", job:"website loading speed", rating:5 },
  { text:"Mehedi is a capable Web Developer. He has advanced technical abilities. His client service is above average. It is a pleasure to recommend him.", author:"Upwork client", job:"New website for our business that is SEO friendly", rating:5 },
  { text:"Mehedi is very sharp and knowledgeable, his experience and talent is shown from his quick deliverables. Eye for design and sharp with coding, highly recommended.", author:"Upwork client", job:"Update landing page with animated css", rating:5 },
  { text:"Great communication. Work done promptly and of high standard. Exactly as per specification.", author:"Upwork client", job:"Responsive HTML/CSS menu with drop down div's", rating:5 },
  { text:"Thank you for your quick help in a fast hour.", author:"Upwork client", job:"Website correction", rating:5 }
];
return { MARQUEE, PROJECTS, REVIEWS };
})();
