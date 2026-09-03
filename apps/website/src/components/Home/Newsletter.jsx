import React from 'react';

const Newsletter = () => {
  return (
    <div className='w-full py-16 text-white bg-[#083002] px-4 border-t border-[#138601]/30'>
      <div className='max-w-[1240px] mx-auto grid lg:grid-cols-3 gap-6 items-center'>
        <div className='lg:col-span-2'>
          <h2 className='md:text-3xl sm:text-2xl text-xl font-bold py-1 text-white'>
            Stay Updated with NACOS FUTO
          </h2>
          <p className='text-sm text-green-200/80'>Subscribe to our department announcements and event notifications.</p>
        </div>
        <div>
          <form onSubmit={(e) => e.preventDefault()} className='flex flex-col sm:flex-row items-center gap-3 w-full'>
            <input
              className='px-4 py-2.5 flex-1 w-full rounded bg-white text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#138601]'
              type='email'
              placeholder='Enter your email address'
              required
            />
            <button 
              type='submit' 
              className='px-7 py-2.5 text-sm font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded shadow-sm transition-colors cursor-pointer whitespace-nowrap inline-flex items-center justify-center min-h-[42px]'
            >
              Subscribe
            </button>
          </form>
          <p className='text-xs text-green-300/70 mt-2'>
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
