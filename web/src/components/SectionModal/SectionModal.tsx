import { useEffect, useState } from 'react';
import IconButton from '../IconButton/IconButton';
import './SectionModal.css';

interface SectionModalProps {
    isOpen: boolean;
    title: string;
    data: any;
    onClose: () => void;
    onSave: (data: any) => void;
}

const SectionModal = ({
    isOpen,
    title,
    data,
    onClose,
    onSave,
}: SectionModalProps) => {

    const [localData, setLocalData] = useState<any>(data);

    useEffect(() => {
        if (isOpen) {
            setLocalData(data);
        }
    }, [isOpen, data]);

    if (!isOpen || !localData) return null;

    const cvSectionLabels: Record<string, string> = {
        photo: 'Photograph',
        contact: 'Contact',
        educations: 'Education',
        workExperience: 'Work Experience',
        projects: 'Projects',
        skills: 'Skills',
        languages: 'Languages',
        certifications: 'Certifications',
        awards: 'Awards',
        hobbies: 'Hobbies',
        references: 'References'
    };

    // CV içerisindeki bölümlerin görünürlüğü
    const toggleCvSectionVisibility = (section: string) => {
        setLocalData((prev: any) => {
        if (section === 'photo') {
            return {
                ...prev,
                personalInformation: {
                    ...prev.personalInformation,
                    photo: {
                        ...prev.personalInformation.photo,
                        visibility: !prev.personalInformation.photo.visibility,
                    },
                },
            };
        }

            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    visibility: !prev[section].visibility,
                },
            };
        });
    };

    // Bölümün genel görünürlüğü
    const toggleSectionVisibility = () => {
        setLocalData((prev: any) => ({
            ...prev,
            visibility: !prev.visibility,
        }));
    };

    // Ana içerik görünürlüğü
    const toggleVisibility = (index: number) => {
        setLocalData((prev: any) => ({
            ...prev,
            content: prev.content.map((item: any, i: number) =>
                i === index
                    ? { ...item, visibility: !item.visibility }
                    : item
            ),
        }));
    };

    // Alt içerik görünürlüğü (subclause)
    const toggleSubItemVisibility = (
        sectionIndex: number,
        subIndex: number
    ) => {
        setLocalData((prev: any) => ({
            ...prev,
            content: prev.content.map((item: any, index: number) => {
                if (index !== sectionIndex) return item;

                const field = title === 'workExperience'
                    ? 'responsibilities'
                    : 'subclause';

                return {
                    ...item,
                    [field]: item[field].map((sub: any, i: number) =>
                        i === subIndex
                            ? { ...sub, visibility: !sub.visibility }
                            : sub
                    ),
                };
            }),
        }));
    };

    // Skills alt içerik görünürlüğü
    const toggleSkillItemVisibility = (
        sectionIndex: number,
        subIndex: number
    ) => {
        setLocalData((prev: any) => ({
            ...prev,
            content: prev.content.map((item: any, index: number) => {
                if (index !== sectionIndex) return item;

                return {
                    ...item,
                    items: item.items.map((sub: any, i: number) =>
                        i === subIndex
                            ? { ...sub, visibility: !sub.visibility }
                            : sub
                    ),
                };
            }),
        }));
    };

    // Summary görünürlüğü
    const toggleSummaryVisibility = (field: string) => {
        setLocalData((prev: any) => {
            const otherField =
                field === 'careerSummary'
                    ? 'careerGoals'
                    : 'careerSummary';

            const otherItem = prev[otherField];

            // Diğer veri yoksa mevcut veriyi kapatmaya izin verme
            if (!otherItem?.text) {
                return prev;
            }

            const newVisibility = !prev[field].visibility;

            const updated = {
                ...prev,
                [field]: {
                    ...prev[field],
                    visibility: newVisibility,
                },
            };

            if (!newVisibility && !otherItem.visibility) {
                updated[otherField] = {
                    ...otherItem,
                    visibility: true,
                };
            }

            return updated;
        });
    };

    // Fotoğraf görünürlüğü
    const togglePhotoVisibility = () => {
        setLocalData((prev: any) => ({
            ...prev,
            visibility: !prev.visibility,
        }));
    };

    const handleSave = () => {
        onSave(localData);
        onClose();
    };

    // Checkbox
    const VisibilityControl = ({
        checked,
        onChange,
    }: {
        checked: boolean;
        onChange: () => void;
    }) => (
        <label className="visibility-control">
            <span>{checked ? 'Show' : 'Hide'}</span>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
            />
            <span className="visibility-switch" />
        </label>
    );

    // İçerik başlığı
    const getItemTitle = (item: any) => {
        switch (title) {
            case 'photo':
                return (
                    <>
                        <strong>Photograph</strong>
                    </>
                );

            case 'contact':
                return item.value;

            case 'educations':
                return (
                    <>
                        {item.Department && <strong>{item.Department}</strong>}
                        <span>{item.SchoolName}</span>
                    </>
                );

            case 'workExperience':
                return item.CompanyName;

            case 'projects':
                return item.ProjectName;

            case 'skills':
                return item.Title;

            case 'languages':
            case 'hobbies':
            case 'references':
                return item.Name;

            case 'certifications':
            case 'awards':
                return (
                    <>
                        <strong>{item.Title}</strong>
                        <span>{item.Issuer}</span>
                    </>
                );

            default:
                return item.title ?? item.name;
        }
    };

    return (
        <div className="section-modal-overlay" onClick={onClose}>

            <div
                className="section-modal"
                onClick={e => e.stopPropagation()}
            >

                <div className="section-modal-header">
                    <h2>
                        {title === 'workExperience'
                            ? 'WORK EXPERIENCE'
                            : title === 'cvSections'
                                ? 'CV SECTIONS'
                                : title.toUpperCase()}
                    </h2>

                    <IconButton icon='close' onClick={onClose} />
                    
                </div>

                <div className="section-modal-content">

                    {/* CV SECTIONS */}
                    {title === 'cvSections' && (
                        <>
                            {Object.entries(cvSectionLabels).map(([key, label]) => {
                                const section = key === 'photo'
                                    ? localData.personalInformation?.photo
                                    : localData[key];

                                if (!section) return null;

                                return (
                                    <div className="section-modal-row" key={key}>
                                        <div className="section-modal-item">
                                            <strong>{label}</strong>
                                        </div>

                                        <VisibilityControl
                                            checked={section.visibility ?? true}
                                            onChange={() => toggleCvSectionVisibility(key)}
                                        />
                                    </div>
                                );
                            })}
                        </>
                    )}

                    {/* PHOTO */}
                    {title === 'photo' && (
                        <div className="section-modal-row">
                            <div className="section-modal-item">
                                <strong>Photograph</strong>
                            </div>

                            <VisibilityControl
                                checked={localData.visibility}
                                onChange={togglePhotoVisibility}
                            />
                        </div>
                    )}

                    {/* SUMMARY */}
                    {title === 'summary' && (
                        <>
                            {['careerSummary', 'careerGoals'].map(field => {
                                const item = localData[field];

                                if (!item?.text) return null;

                                return (
                                    <div
                                        className="section-modal-row"
                                        key={field}
                                    >
                                        <div className="section-modal-item">
                                            <strong>
                                                {field === 'careerSummary'
                                                    ? 'Career Summary'
                                                    : 'Career Goals'}
                                            </strong>
                                            <p>{item.text}</p>
                                        </div>

                                        <VisibilityControl
                                            checked={item.visibility}
                                            onChange={() =>
                                                toggleSummaryVisibility(field)
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </>
                    )}

                    {/* NORMAL SECTIONS */}
                    {title !== 'photo' && title !== 'summary' && title !== 'cvSections' && (
                        <>
                            <div className="section-modal-row section-modal-main-toggle">
                                <strong>{title.toUpperCase()}</strong>

                                <VisibilityControl
                                    checked={localData.visibility}
                                    onChange={toggleSectionVisibility}
                                />
                            </div>

                            {localData.content?.map(
                                (item: any, index: number) => {

                                    if (
                                        title === 'contact' && !item.value
                                    ) return null;

                                    return (
                                        <div
                                            className="section-modal-item-container"
                                            key={item.Id ?? index}
                                        >

                                            <div className="section-modal-row">
                                                <div className="section-modal-item">
                                                    {getItemTitle(item)}
                                                </div>

                                                <VisibilityControl
                                                    checked={item.visibility}
                                                    onChange={() =>
                                                        toggleVisibility(index)
                                                    }
                                                />
                                            </div>

                                            {/* WORK EXPERIENCE RESPONSIBILITIES */}
                                            {title === 'workExperience' && (
                                                <div className="section-modal-subitems">
                                                    {(item.responsibilities ?? []).map(
                                                        (sub: any, subIndex: number) => (
                                                            <div
                                                                className="section-modal-row"
                                                                key={sub.Id ?? subIndex}
                                                            >
                                                                <span>{sub.description}</span>

                                                                <VisibilityControl
                                                                    checked={sub.visibility}
                                                                    onChange={() =>
                                                                        toggleSubItemVisibility(index, subIndex)
                                                                    }
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}

                                            {/* PROJECT SUBCLAUSES */}
                                            {title === 'projects' && (
                                                <div className="section-modal-subitems">
                                                    {(item.subclause ?? []).map(
                                                        (sub: any, subIndex: number) => (
                                                            <div
                                                                className="section-modal-row"
                                                                key={sub.Id ?? subIndex}
                                                            >
                                                                <span>{sub.text}</span>

                                                                <VisibilityControl
                                                                    checked={sub.visibility ?? true}
                                                                    onChange={() =>
                                                                        toggleSubItemVisibility(index, subIndex)
                                                                    }
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}

                                            {/* SKILL ITEMS */}
                                            {title === 'skills' && (
                                                <div className="section-modal-subitems">
                                                    {(item.items ?? []).map(
                                                        (sub: any, subIndex: number) => (
                                                            <div
                                                                className="section-modal-row"
                                                                key={sub.Id ?? subIndex}
                                                            >
                                                                <span>{sub.Name}</span>

                                                                <VisibilityControl
                                                                    checked={sub.visibility ?? true}
                                                                    onChange={() =>
                                                                        toggleSkillItemVisibility(index, subIndex)
                                                                    }
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}

                                        </div>
                                    );
                                }
                            )}
                        </>
                    )}

                </div>

                <div className="section-modal-footer">
                    <button
                        className="section-modal-cancel"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="section-modal-save"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SectionModal;
