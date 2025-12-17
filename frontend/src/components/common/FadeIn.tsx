import { motion } from 'framer-motion';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    className?: string;
    fullWidth?: boolean;
}

const FadeIn: React.FC<FadeInProps> = ({
    children,
    delay = 0,
    direction = 'up',
    className = '',
    fullWidth = false,
}) => {
    const getInitialPosition = () => {
        switch (direction) {
            case 'up':
                return { opacity: 0, y: 40 };
            case 'down':
                return { opacity: 0, y: -40 };
            case 'left':
                return { opacity: 0, x: 40 };
            case 'right':
                return { opacity: 0, x: -40 };
            case 'none':
                return { opacity: 0 };
            default:
                return { opacity: 0, y: 40 };
        }
    };

    return (
        <motion.div
            initial={getInitialPosition()}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.9, delay: delay, ease: 'easeOut' }}
            className={`${className} ${fullWidth ? 'w-full' : ''}`}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;
