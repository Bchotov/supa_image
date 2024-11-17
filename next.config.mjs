/** @type {import('next').Config} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jzojjqbanjimbbnvoonn.supabase.co',
        pathname: '/storage/v1/object/public/images/**',
      },
    ],
  },
}

export default config 