# Classi: Reinventing Course Reviews

## Inspiration  
A few weeks ago, one of our team members, Sean, downloaded an app called **Beli**, a restaurant ranking platform that uses **pairwise comparisons** instead of static ratings. Despite never being a restaurant reviewer, he found himself ranking nearly **200 restaurants** in just a few days. Why? Because Beli makes the process **interactive, social, and fun**. This sparked an idea—what if we applied this same concept to course reviews?  

Traditional course review platforms struggle with **low engagement**, leading to many classes lacking reviews. Without enough data, students are left guessing when selecting courses. By making the ranking process as **engaging and game-like** as Beli, we realized we could **incentivize students to participate more**, leading to **richer, more complete data** that benefits everyone.  

## What It Does  
Classi transforms the way students rank and review courses and professors. Instead of assigning fixed ratings, users **compare two options at a time**, dynamically **refining their personal rankings** through a **binary search-based system**. This reduces **decision fatigue** while making ranking **fast, intuitive, and fun**.  

Beyond rankings, Classi offers:  
- **Social features** – Compare ratings/rankings with friends.  
- **Comprehensive profiles** – See difficulty, workload, and student reviews at a glance.  
- **Powerful search & filters** – Find the best courses for your learning style.  

## How We Built It  
Classi is designed for **speed, usability, and scalability**, using:  
- **Frontend:** Next.js for a seamless, interactive experience.  
- **Backend:** Express.js for handling API requests efficiently.  
- **Database:** MongoDB for storing rankings, reviews, and user data.  

We focused on keeping interactions **lightweight and engaging**, ensuring students could make meaningful comparisons with just a few taps.  

## Challenges We Ran Into  
Implementing an efficient binary insertion method that dynamically updates rankings was a major challenge, especially since our team lacked extensive experience with backend development. Working with Express.js and MongoDB for the first time made it particularly tricky to structure and optimize our database for fast and scalable ranking updates. We had to quickly learn how to handle data storage, retrieval, and ranking logic while ensuring smooth performance. Debugging issues related to asynchronous operations, database schema design, and API efficiency took time, but overcoming these hurdles significantly improved our backend skills.


## What We Learned  
- **User engagement thrives on interaction.** Making ranking feel like a game drastically increases participation.  
- **Traditional rating systems are flawed.** Static reviews don’t incentivize enough data collection.  
- **Social features drive retention.** Users are more likely to engage when they can compare rankings with friends.  

## What’s Next for Classi  
- **Expanding Social Features:** Adding more leaderboard features, different categories of ranked lists, and global scores for courses based on entire student body.  
- **AI-Powered Recommendations:** Using machine learning to suggest courses based on ranking patterns.  
- **Mobile App Development:** Bringing Classi to iOS and Android for even easier access.  
- **Integration with University Platforms:** Partnering with schools to provide official course insights.  

By transforming course selection into an **engaging, personalized, and data-driven experience**, Classi has the potential to revolutionize how students **discover, rank, and review their academic options**.   
