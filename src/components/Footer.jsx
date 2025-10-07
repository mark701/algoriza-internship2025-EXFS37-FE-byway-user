import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 h-full text-gray-300 px-8 py-20 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <div className="flex items-center mb-4">
            <img src={`${process.env.PUBLIC_URL}/Assets/Icons/logo.png`} alt="Byway Logo" className="w-8 h-8 mr-2" />
            <span className="font-bold text-white text-lg">Byway</span>
          </div>
          <p className="text-gray-400 text-sm">
            Empowering learners through accessible and engaging online education. Byway is a leading online learning platform dedicated to providing high-quality, flexible, and affordable educational experiences.
          </p>
        </div>

        {/* Get Help */}
        <div>
          <h3 className="text-white font-semibold mb-4">Get Help</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><div className="hover:text-white">Contact Us</div></li>
            <li><div className="hover:text-white">Latest Articles</div></li>
            <li><div className="hover:text-white">FAQ</div></li>
          </ul>
        </div>

        {/* Programs */}
        <div>
          <h3 className="text-white font-semibold mb-4">Programs</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><div className="hover:text-white">Art & Design</div></li>
            <li><div className="hover:text-white">Business</div></li>
            <li><div className="hover:text-white">IT & Software</div></li>
            <li><div className="hover:text-white">Languages</div></li>
            <li><div className="hover:text-white">Programming</div></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Us</h3>
          <p className="text-gray-400 text-sm">Address: 123 Main Street, Anytown, CA 12345</p>
          <p className="text-gray-400 text-sm mt-1">Tel: (+123) 456-7890</p>
          <p className="text-gray-400 text-sm mt-1">Mail: bywayedu@webkul.in</p>
          <div className="flex space-x-3 mt-4 text-gray-400">
            <div>
              <img src="Assets/Icons/FullContact.png"  alt="Full Social media"/>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
