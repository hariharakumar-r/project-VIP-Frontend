export default function Contact() {
  return (
    <section id="contact" className="flex min-h-[60vh] items-center justify-center bg-white">
      <div className="mx-auto w-full max-w-lg py-8">
        <h1 className="text-4xl font-medium text-gray-900">Contact us</h1>
        <p className="mt-2 text-gray-700">
          Email us at <a href="mailto:help@domain.com" className="text-blue-600 underline">help@domain.com</a> or message us here:
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
                className="peer block w-full appearance-none border-0 border-b border-gray-500 bg-transparent py-2 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                placeholder=" "
              />
              <label className="absolute top-3 -z-10 origin-left -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600">
                Your name
              </label>
            </div>
            <div className="relative z-0">
              <input
                type="email"
                name="email"
                required
                className="peer block w-full appearance-none border-0 border-b border-gray-500 bg-transparent py-2 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                placeholder=" "
              />
              <label className="absolute top-3 -z-10 origin-left -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600">
                Your email
              </label>
            </div>
            <div className="relative z-0 col-span-2">
              <textarea
                name="message"
                rows="5"
                required
                className="peer block w-full appearance-none border-0 border-b border-gray-500 bg-transparent py-2 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                placeholder=" "
              ></textarea>
              <label className="absolute top-3 -z-10 origin-left -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600">
                Your message
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 rounded-md bg-black px-10 py-2 text-white hover:bg-gray-800 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}