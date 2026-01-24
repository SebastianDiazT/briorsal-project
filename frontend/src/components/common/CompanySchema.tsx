import { Helmet } from 'react-helmet-async';
import { useGetCompanyInfoQuery } from '@/features/company/api/companyApi';

export const CompanySchema = () => {
    const { data: response } = useGetCompanyInfoQuery();
    const info = response?.data;

    if (!info) return null;

    const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'GeneralContractor',
        name: 'Briorsal Constructora',
        image: 'https://constructorabriorsal.com/assets/logo-rGW_qBdx.png',
        url: 'https://constructorabriorsal.com/',
        telephone: info.phone || '+51970507372',
        email: info.email,
        priceRange: '$$',
        address: {
            '@type': 'PostalAddress',
            streetAddress: info.address,
            addressLocality: 'Arequipa',
            addressRegion: 'Arequipa',
            addressCountry: 'PE',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: -16.39889,
            longitude: -71.536961,
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                ],
                opens: '08:00',
                closes: '17:00',
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Saturday',
                opens: '08:00',
                closes: '13:00',
            },
        ],
        sameAs: [
            info.facebook,
            info.instagram,
            info.linkedin,
            info.tiktok,
        ].filter((url) => url && url.length > 0),
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>
        </Helmet>
    );
};
