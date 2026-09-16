import Footer from '../components/Footer';
import peterPhoto from '../assets/team/photos/peter.JPG';
import samPhoto from '../assets/team/photos/sam.jpeg';
import danielPhoto from '../assets/team/photos/daniel.jpeg';
import joshPhoto from '../assets/team/photos/josh.jpeg';
import tygoPhoto from '../assets/team/photos/tygo.jpeg';
import thetPhoto from '../assets/team/photos/thet.png';
import isabellePhoto from '../assets/team/photos/isabelle.jpg';

const boardMembers = [
  { photo: peterPhoto, name: "Peter", role: "President" },
  { photo: samPhoto, name: "Sam", role: "Vice President" },
  { photo: danielPhoto, name: "Daniel", role: "Website Coordinator" },
  { photo: joshPhoto, name: "Josh", role: "Secretary" },
  { photo: tygoPhoto, name: "Tygo", role: "Treasurer" },
  { photo: thetPhoto, name: "Thet", role: "ICC Delegate" },
  { photo: isabellePhoto, name: "Isabelle", role: "Publicity Officer" },
];

/**
 * Team Page - Modern Responsive Implementation
 * CSS Grid layout with fluid typography and natural scrolling
 */
function Team() {
  return (
    <>
      <div className="team-page">
        {/* Title */}
        <h1 className="page-title">OUR TEAM</h1>

        {/* Cards Grid Container */}
        <div className="cards-grid">
          {boardMembers.map((member, index) => (
            <div
              key={member.role + index}
              className="card"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <p className="member-name">{member.name}</p>
              <div className="card-bg">
                <img src={member.photo} alt={member.name} className="member-photo" />
              </div>
              <p className="role-title">{member.role}</p>
            </div>
          ))}
        </div>

      </div>

      <Footer />

      <style>{`
        .team-page {
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: clamp(140px, 12vh, 200px) clamp(1.5rem, 5vw, 5rem) 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow-x: hidden;
        }

        .page-title {
          width: fit-content;
          font-family: 'Russo One', sans-serif;
          font-size: clamp(3rem, 5.2vw, 6.25rem);
          font-weight: 400;
          line-height: normal;
          color: #F1F5F9;
          margin: 0 0 clamp(1rem, 2vh, 2rem) 0;
          text-align: center;
        }

        /* Cards Grid - Modern Responsive Layout */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 367px));
          gap: clamp(1.5rem, 3vw, 3rem);
          justify-content: center;
          width: 100%;
          max-width: 1600px;
          margin-bottom: clamp(2rem, 4vh, 4rem);
        }

        /* Force 3 columns on large screens */
        @media (min-width: 1200px) {
          .cards-grid {
            grid-template-columns: repeat(3, minmax(320px, 367px));
          }
        }

        @keyframes cardAppear {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes borderCycle {
          0% {
            border-color: #66C48A;
            box-shadow: 0 4px 25px rgba(102, 196, 138, 0.4);
          }
          25% {
            border-color: #4ECDC4;
            box-shadow: 0 4px 25px rgba(78, 205, 196, 0.4);
          }
          50% {
            border-color: #45B7D1;
            box-shadow: 0 4px 25px rgba(69, 183, 209, 0.4);
          }
          75% {
            border-color: #96E6A1;
            box-shadow: 0 4px 25px rgba(150, 230, 161, 0.4);
          }
          100% {
            border-color: #66C48A;
            box-shadow: 0 4px 25px rgba(102, 196, 138, 0.4);
          }
        }

        /* Officer Cards */
        .card {
          position: relative;
          width: 100%;
          max-width: 367px;
          justify-self: center;
          opacity: 0;
          animation:
            cardAppear 0.6s ease-out forwards,
            float 3.5s ease-in-out 0.6s infinite;
        }

        .card-bg {
          width: 100%;
          aspect-ratio: 367 / 533;
          border: 5px solid #66C48A;
          border-radius: 12px;
          overflow: hidden;
          animation: borderCycle 6s ease-in-out infinite;
        }

        .member-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }

        .member-name {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 5.25%;
          z-index: 10;
          font-family: 'Russo One', sans-serif;
          font-size: clamp(1.25rem, 1.5vw, 1.5rem);
          font-weight: 400;
          line-height: normal;
          text-align: center;
          color: #F1F5F9;
          background: rgba(0, 0, 0, 0.7);
          padding: 0.5rem 1rem;
          border-radius: 6px;
          margin: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .role-title {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 5.25%;
          z-index: 10;
          font-family: 'Russo One', sans-serif;
          font-size: clamp(1.25rem, 1.5vw, 1.5rem);
          font-weight: 400;
          line-height: normal;
          text-align: center;
          color: #F1F5F9;
          background: rgba(0, 0, 0, 0.7);
          padding: 0.5rem 1rem;
          border-radius: 6px;
          margin: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .card:hover .member-name,
        .card:hover .role-title {
          opacity: 0.2;
        }

        /* Tablet - 2 Column Layout */
        @media (max-width: 1024px) {
          .cards-grid {
            grid-template-columns: repeat(2, minmax(280px, 367px));
            gap: clamp(1.25rem, 2.5vw, 2.5rem);
          }

          .page-title {
            font-size: clamp(2.5rem, 6vw, 4rem);
          }
        }

        /* Mobile - Single Column Layout */
        @media (max-width: 768px) {
          .team-page {
            padding: clamp(120px, 10vh, 160px) clamp(1rem, 4vw, 2rem) 0;
          }

          .cards-grid {
            grid-template-columns: 1fr;
            gap: clamp(1rem, 2vh, 2rem);
            max-width: 400px;
          }

          .page-title {
            font-size: clamp(2rem, 7vw, 3rem);
            margin-bottom: clamp(0.75rem, 1.5vh, 1.5rem);
          }

          .title-underline {
            margin-bottom: clamp(1.5rem, 3vh, 3rem);
          }

          .member-name,
          .role-title {
            font-size: clamp(1rem, 4vw, 1.25rem);
          }
        }

      `}</style>
    </>
  );
}

export default Team;
