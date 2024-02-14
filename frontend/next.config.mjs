/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'export',
    // distDir: 'build',

    generateStaticParams: async function () {
        return [
          { route: '/app/page' },
          { route: '/app/select_game/page' },
          { route: '/app/type_game/page' },
          { route: '/app/edit_words/page' },
        ];
    },
};

export default nextConfig;
