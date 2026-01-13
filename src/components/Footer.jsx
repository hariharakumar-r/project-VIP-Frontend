import { Link } from "react-router-dom";
import Socials from "./Socials";

export default function Footer() {
  return (
    <footer className="bg-white rounded-lg mt-12 shadow-lg">
      <div className="container flex flex-col mx-auto">
        <div className="flex flex-col items-center w-full my-20">
          <span className="mb-8">
            {/* Project VIP Logo SVG */}
            <svg width="140" viewBox="0 0 419 95" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* ...SVG paths as in your code... */}
              {/* You can keep your SVG code here unchanged */}
            </svg>
          </span>
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="flex flex-wrap items-center justify-center gap-5 lg:gap-12 gap-y-3 lg:flex-nowrap text-dark-grey-900">
              <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#blog" className="text-gray-600 hover:text-gray-900">Blog</a>
              <a href="#resources" className="text-gray-600 hover:text-gray-900">Resources</a>
              <a href="#partners" className="text-gray-600 hover:text-gray-900">Partners</a>
              <a href="#help" className="text-gray-600 hover:text-gray-900">Help</a>
              <a href="/terms" className="text-gray-600 hover:text-gray-900">Terms</a>
            </div>
            <div className="flex items-center gap-8">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                {/* Facebook SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M13.6348 20.7273V12.766H16.3582L16.7668 9.66246H13.6348V7.68128C13.6348 6.78301 13.8881 6.17085 15.2029 6.17085L16.877 6.17017V3.39424C16.5875 3.35733 15.5937 3.27273 14.437 3.27273C12.0216 3.27273 10.368 4.71881 10.368 7.37391V9.66246H7.63636V12.766H10.368V20.7273H13.6348Z" fill="currentColor"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                {/* Twitter SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M21.8182 6.14597C21.1356 6.44842 20.4032 6.65355 19.6337 6.74512C20.4194 6.27461 21.0208 5.5283 21.3059 4.64176C20.5689 5.07748 19.7553 5.39388 18.8885 5.56539C18.1943 4.82488 17.207 4.36364 16.1118 4.36364C14.0108 4.36364 12.3072 6.06718 12.3072 8.16706C12.3072 8.46488 12.3408 8.75576 12.4058 9.03391C9.24436 8.87512 6.44106 7.36048 4.56485 5.05894C4.23688 5.61985 4.0503 6.27342 4.0503 6.97109C4.0503 8.29106 4.72246 9.45573 5.74227 10.1371C5.11879 10.1163 4.53239 9.94476 4.01903 9.65967V9.70718C4.01903 11.5498 5.33088 13.0876 7.07033 13.4376C6.75164 13.5234 6.41558 13.5709 6.06791 13.5709C5.82224 13.5709 5.58467 13.5465 5.35173 13.5002C5.83612 15.0125 7.2407 16.1123 8.90485 16.1424C7.60343 17.1622 5.96246 17.7683 4.18012 17.7683C3.87303 17.7683 3.57055 17.7498 3.27273 17.7162C4.95658 18.7974 6.95564 19.4278 9.10418 19.4278C16.1026 19.4278 19.9281 13.6312 19.9281 8.60397L19.9153 8.11145C20.6628 7.57833 21.3094 6.90851 21.8182 6.14597Z" fill="currentColor"/></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                {/* GitHub SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path d="M12 3C7.0275 3 3 7.13211 3 12.2284C3 16.3065 5.5785 19.7648 9.15375 20.9841C9.60375 21.0709 9.76875 20.7853 9.76875 20.5403C9.76875 20.3212 9.76125 19.7405 9.7575 18.9712C7.254 19.5277 6.726 17.7332 6.726 17.7332C6.3165 16.6681 5.72475 16.3832 5.72475 16.3832C4.9095 15.8111 5.78775 15.8229 5.78775 15.8229C6.6915 15.887 7.16625 16.7737 7.16625 16.7737C7.96875 18.1847 9.273 17.777 9.7875 17.5414C9.8685 16.9443 10.1003 16.5381 10.3575 16.3073C8.35875 16.0764 6.258 15.2829 6.258 11.7471C6.258 10.7399 6.60675 9.91659 7.18425 9.27095C7.083 9.03774 6.77925 8.0994 7.263 6.82846C7.263 6.82846 8.01675 6.58116 9.738 7.77462C10.458 7.56958 11.223 7.46785 11.988 7.46315C12.753 7.46785 13.518 7.56958 14.238 7.77462C15.948 6.58116 16.7017 6.82846 16.7017 6.82846C17.1855 8.0994 16.8818 9.03774 16.7917 9.27095C17.3655 9.91659 17.7142 10.7399 17.7142 11.7471C17.7142 15.2923 15.6105 16.0725 13.608 16.2995C13.923 16.5765 14.2155 17.1423 14.2155 18.0071C14.2155 19.242 14.2043 20.2344 14.2043 20.5341C14.2043 20.7759 14.3617 21.0647 14.823 20.9723C18.4237 19.7609 21 16.3002 21 12.2284C21 7.13211 16.9703 3 12 3Z" fill="currentColor"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                {/* Instagram SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M7.60063 2.18182H16.3991C19.3873 2.18182 21.8183 4.61281 21.8182 7.60074V16.3993C21.8182 19.3872 19.3873 21.8182 16.3991 21.8182H7.60063C4.6127 21.8182 2.18182 19.3873 2.18182 16.3993V7.60074C2.18182 4.61281 4.6127 2.18182 7.60063 2.18182ZM16.3993 20.0759C18.4266 20.0759 20.0761 18.4266 20.0761 16.3993H20.0759V7.60074C20.0759 5.57348 18.4265 3.92405 16.3991 3.92405H7.60063C5.57336 3.92405 3.92405 5.57348 3.92405 7.60074V16.3993C3.92405 18.4266 5.57336 20.0761 7.60063 20.0759H16.3993ZM6.85714 12.0001C6.85714 9.16424 9.16418 6.85714 12 6.85714C14.8358 6.85714 17.1429 9.16424 17.1429 12.0001C17.1429 14.8359 14.8358 17.1429 12 17.1429C9.16418 17.1429 6.85714 14.8359 6.85714 12.0001ZM8.62798 12C8.62798 13.8593 10.1407 15.3719 12 15.3719C13.8593 15.3719 15.372 13.8593 15.372 12C15.372 10.1406 13.8594 8.6279 12 8.6279C10.1406 8.6279 8.62798 10.1406 8.62798 12Z" fill="currentColor"/></svg>
              </a>
            </div>
          </div>
          <div className="flex items-center">
            <p className="text-base font-normal leading-7 text-center text-gray-700">
              © {new Date().getFullYear()} Project VIP. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}