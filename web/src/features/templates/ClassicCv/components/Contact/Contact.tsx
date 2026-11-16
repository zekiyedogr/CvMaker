import './Contact.css';

import { FaPhone, FaLocationDot, FaEnvelope, FaLinkedinIn, FaGithub, FaGlobe, FaXTwitter, FaMedium, FaDev, FaHashnode, FaDribbble,
    FaBehance, FaStackOverflow, FaSkype, FaVideo, FaDiscord } from 'react-icons/fa6';

interface ContactItem {
    field: string;
    value: string;
    visibility: boolean;
}

interface ContactProps {
    contact: {
        visibility: boolean;
        content: ContactItem[];
    };
}

const contactIcons: Record<string, React.ElementType> = {
    phone: FaPhone,
    location: FaLocationDot,
    email: FaEnvelope,
    linkedin: FaLinkedinIn,
    github: FaGithub,
    portfolio: FaGlobe,
    x: FaXTwitter,
    medium: FaMedium,
    devto: FaDev,
    hashnode: FaHashnode,
    dribbble: FaDribbble,
    behance: FaBehance,
    stackoverflow: FaStackOverflow,
    skype: FaSkype,
    zoom: FaVideo,
    discord: FaDiscord,
};

const Contact = ({ contact }: ContactProps) => {
    if (!contact?.visibility) return null;

    const urlFields = [
        'linkedin', 'github', 'portfolio', 'x', 'medium',
        'devto', 'hashnode', 'dribbble', 'behance',
        'stackoverflow', 'skype', 'zoom', 'discord',
    ];

    const formatValue = (key: string, value: string) => {
        if (!urlFields.includes(key)) return value;

        try {
            const url = new URL(
                value.startsWith('http') ? value : `https://${value}`
            );

            if (key === 'portfolio') {
                return url.hostname.replace(/^www\./, '');
            }

            return url.pathname.replace(/\/$/, '') || url.hostname;
        } catch {
            return value;
        }
    };
    return (
        <div className="classic-contact">

            <h3 className="classic-contact-title cv-title">
                CONTACT
            </h3>

            {contact.content.map((item) => {
                const Icon = contactIcons[item.field];

                if (!item.visibility || !item.value || !Icon) {
                    return null;
                }

                const text = formatValue(item.field, item.value);

                return (
                    <div className="classic-contact-item" key={item.field} >
                        <Icon className="classic-contact-icon" />

                        <span className="classic-contact-text cv-content">
                            {text}
                        </span>
                    </div>
                );
            })}

        </div>
    );
};

export default Contact;
