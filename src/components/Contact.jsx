export default function Contact() {
  return (
    <section id="contact" className="flex min-h-[60vh] items-center justify-center">
      <div className="mx-auto w-full max-w-lg py-8 px-4">
        <h1 className="text-4xl font-medium text-white drop-shadow">Contact us</h1>
        <p className="mt-2 text-gray-200">
          Email us at <a href="mailto:help@domain.com" className="text-red-400 underline hover:text-red-300">help@domain.com</a> or message us here:
        </p>

        <form
          // action="https://api.web3forms.com/submit"
          method="POST"
          className="mt-8"
        >
          <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative z-0">
              <input
                type="text"
                name="name"
                required
                className="peer block w-full appearance-none border-0 border-b border-gray-400 bg-transparent py-2 px-0 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-0 placeholder-transparent"
                placeholder=" "
              />
              <label className="absolute top-3 -z-10 origin-left -translate-y-6 scale-75 transform text-sm text-gray-300 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-red-400">
                Your name
              </label>
            </div>
            <div className="relative z-0">
              <input
                type="email"
                name="email"
                required
                className="peer block w-full appearance-none border-0 border-b border-gray-400 bg-transparent py-2 px-0 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-0 placeholder-transparent"
                placeholder=" "
              />
              <label className="absolute top-3 -z-10 origin-left -translate-y-6 scale-75 transform text-sm text-gray-300 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-red-400">
                Your email
              </label>
            </div>
            <div className="relative z-0 col-span-2">
              <textarea
                name="message"
                rows="5"
                required
                className="peer block w-full appearance-none border-0 border-b border-gray-400 bg-transparent py-2 px-0 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-0 placeholder-transparent"
                placeholder=" "
              ></textarea>
              <label className="absolute top-3 -z-10 origin-left -translate-y-6 scale-75 transform text-sm text-gray-300 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-red-400">
                Your message
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 rounded-md bg-red-700 px-10 py-2 text-white hover:bg-red-800 transition shadow-lg"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}