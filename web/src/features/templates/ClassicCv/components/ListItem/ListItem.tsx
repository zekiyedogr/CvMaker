import { useMemo } from 'react';
import './ListItem.css';

interface ListItemProps {
    items: {
        visibility: boolean;
        singularTitle: string;
        pluralTitle: string;
        content: any[];
    };
    lang?: Record<string, any>;
}

const languageLevels = [
    'Beginner',
    'Elementary',
    'Intermediate',
    'Upper Intermediate',
    'Advanced',
    'Native',
];

const getLanguageLevel = (level: string, lang?: Record<string, any>) => {
    if (!languageLevels.includes(level)) {
        return level;
    }

    return lang?.[level] || level;
};

const ListItem = ({ items, lang }: ListItemProps) => {

    if (!items?.content) return null;

    const formattedList = useMemo(() => {
        const type = items.pluralTitle.toLowerCase();

        let formattedList: { id: number | string; name: string }[] = [];

        // HOBBIES
        if (type === 'hobbies') {
            formattedList = items.content
                .filter(item => item.visibility)
                .map(item => ({
                    id: item.Id,
                    name: item.Name,
                }));
        }

        // LANGUAGES
        else if (type === 'languages') {
            formattedList = items.content
                .filter(item => item.visibility)
                .map(item => ({
                    id: item.Id,
                    name: `${item.Name} ( ${getLanguageLevel(item.Levels, lang)} )`,
                }));
        }

        // SKILLS
        else if (type === 'skills') {
            const all: { id: number | string; name: string }[] = [];

            items.content.forEach(group => {
                if (!group.visibility) return;

                (group.items || []).forEach((skill: any) => {
                    if (skill.visibility) {
                        all.push({
                            id: skill.Id,
                            name: skill.Name,
                        });
                    }
                });
            });

            formattedList = all;
        }

        return formattedList;
    }, [items, lang]);

    if (!items.visibility || formattedList.length === 0) return null;

    const title = formattedList.length > 1
        ? items.pluralTitle
        : items.singularTitle;

    return (
        <div className="classic-list-item classic-content-area">
            <h3 className="cv-title classic-list-title">
                {title.toUpperCase()}
            </h3>

            <div className="classic-list-content">
                {formattedList.map(item => (
                    <div className="classic-list-row" key={item.id}>
                        <span className="classic-list-bullet">•</span>

                        <span className="cv-content">
                            {item.name}
                        </span>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ListItem;
