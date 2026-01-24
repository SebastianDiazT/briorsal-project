import { HelmetProvider, Helmet } from 'react-helmet-async';

const PageMeta = ({
    title,
    description,
    image = 'https://constructorabriorsal.com/assets/logo-rGW_qBdx.png',
}: {
    title: string;
    description: string;
    image?: string;
}) => (
    <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:type" content="website" />
    </Helmet>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
    <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
