import './Classic.css';

import type { CSSProperties } from 'react';

import IconButton from '../../../components/IconButton/IconButton';

import Contact from './components/Contact/Contact';
import Education from './components/Education/Education';
import ListItem from './components/ListItem/ListItem';
import Project from './components/Project/Project';
import Summary from './components/Summary/Summary';
import Experience from './components/Experience/Experience';
import Achievement from './components/Achievement/Achievement';
import Reference from './components/Reference/Reference';

interface ClassicProps {
    contentProfile: any;
    onEditSection?: (section: string) => void;
}

const Classic = ({ contentProfile, onEditSection }: ClassicProps) => {
    const {
        personalInformation,
        summary,
        contact,
        educations,
        workExperience,
        projects,
        skills,
        languages,
        certifications,
        awards,
        hobbies,
        references,
        theme,
        sizes,
        heading,
        body,
        isEditing
    } = contentProfile;
    const serverUrl = (import.meta.env.VITE_API_URL ?? '')
        .replace(/\/api\/?$/, '');

    const imageUrl = contentProfile.personalInformation.photo.value
        ? `${serverUrl}${contentProfile.personalInformation.photo.value}`
        : null;
        

    const cvVariables = {
        '--cv-left-bg': theme.mainColor,
        '--cv-right-bg': theme.white,

        '--cv-left-color': theme.white,
        '--cv-right-color': theme.secondColor,

        '--cv-left-title-color': theme.white,
        '--cv-right-title-color': theme.mainColor,

        '--cv-title-size': `${sizes.fontChapterTitles}px`,
        '--cv-subtitle-size': `${sizes.fontTitles}px`,
        '--cv-content-size': `${sizes.fontText}px`,
        '--cv-small-size': `${sizes.fontTextSmall}px`,

        '--cv-heading-font': heading.html,
        '--cv-body-font': body.html,

        '--cv-padding': `${sizes.leftPadding}px`,
        '--cv-gap': `${sizes.step}px`,

        '--cv-title-border-width': `${sizes.sizeValue}px`,
        '--cv-photo-border-width': '3px',

        '--cv-name-size': `${sizes.fontNameSize}px`,
        '--cv-profession-size': `${sizes.fontProfSize}px`,
        '--cv-name-line-width': `${sizes.lineWidth}px`,
        '--cv-name-line-height': `${sizes.lineHeight}px`,
    } as CSSProperties & {
        [key: `--${string}`]: string | number;
    };
    

    return (
        <div className="classic-cv" style={cvVariables}>

            {/* LEFT */}
            <div className="classic-left cv-left">

                {imageUrl && personalInformation.photo.visibility && (
                    <div className="classic-photo-container classic-content-area">
                        {isEditing && (
                            <div className="edit-button-visib">
                                <IconButton icon="edit" onClick={() => onEditSection?.('photo')} />
                            </div>
                        )} 
                        <img
                            src={imageUrl}
                            alt="Profile"
                            className="classic-profile-photo"
                        />
                    </div>
                )}

                {
                    contact.visibility ? (
                        <div className='classic-content-area'>
                            {isEditing && (
                                <div className="edit-button-visib">
                                    <IconButton icon="edit" onClick={() => {onEditSection?.('contact')}} />
                                </div>
                            )} 
                            <Contact contact={contact} />
                        </div>
                        
                    ) : null
                }

                {
                    educations.visibility ? (
                        <div className='classic-content-area'>
                            {isEditing && (
                                <div className="edit-button-visib">
                                    <IconButton icon="edit" onClick={() => {onEditSection?.('educations')}} />
                                </div>
                            )} 
                            <Education education={educations} />
                        </div>
                        
                    ) : null
                }

                {
                    skills.visibility ? (
                        <div className='classic-content-area'>
                            {isEditing && (
                                <div className="edit-button-visib">
                                    <IconButton icon="edit" onClick={() => {onEditSection?.('skills')}} />
                                </div>
                            )} 
                            <ListItem items={skills} />
                        </div>
                        
                    ) : null
                }

                {
                    languages.visibility ? (
                        <div className='classic-content-area'>
                            {isEditing && (
                                <div className="edit-button-visib">
                                    <IconButton icon="edit" onClick={() => {onEditSection?.('languages')}} />
                                </div>
                            )} 
                            <ListItem items={languages} />
                        </div>
                        
                    ) : null
                }

                {
                    hobbies.visibility ? (
                        <div className='classic-content-area'>
                            {isEditing && (
                                <div className="edit-button-visib">
                                    <IconButton icon="edit" onClick={() => {onEditSection?.('hobbies')}} />
                                </div>
                            )} 
                            <ListItem items={hobbies} />
                        </div>
                        
                    ) : null
                }

                {
                    projects.visibility ? (
                        <div className='classic-content-area'>
                            {isEditing && (
                                <div className="edit-button-visib">
                                    <IconButton icon="edit" onClick={() => {onEditSection?.('projects')}} />
                                </div>
                            )} 
                            <Project projects={projects} />
                        </div>
                        
                    ) : null
                }              
            </div>

            {/* RIGHT */}
            <div className="classic-right cv-right">
                <div className="classic-name-container">
                    <div className="classic-name classic-content-area">
                        {isEditing && (
                                <div className="edit-button-visib">
                                    <IconButton icon="edit" onClick={() => {onEditSection?.('cvSections')}} />
                                </div>
                            )} 
                        <span className="classic-first-name">
                            {personalInformation.firstName?.toUpperCase()}
                        </span>

                        <span className="classic-last-name">
                            {personalInformation.lastName?.toUpperCase()}
                        </span>
                    </div>

                    {personalInformation.profession && (
                        <div className="classic-profession">
                            {personalInformation.profession.toUpperCase()}
                        </div>
                    )}

                    <div className="classic-name-line" />
                </div>
                
                {
                    summary ? (
                        <div className='classic-content-area'>                            
                            {isEditing && (
                                <div className="edit-button-visib">
                                    <IconButton icon="edit" onClick={() => {onEditSection?.('summary')}} />
                                </div>
                            )} 
                            <Summary summary={summary} />
                        </div>
                        
                    ) : null
                }

                {
                    workExperience.visibility ? (
                        <div className='classic-content-area'>
                            {isEditing && (
                                <div className="edit-button-visib">
                                    <IconButton icon="edit" onClick={() => {onEditSection?.('workExperience')}} />
                                </div>
                            )} 
                            <Experience experience={workExperience} />
                        </div>
                        
                    ) : null
                }

                {
                    certifications.visibility ? (
                        <div className='classic-content-area'>
                            {isEditing && (
                                <div className="edit-button-visib">
                                    <IconButton icon="edit" onClick={() => {onEditSection?.('certifications')}} />
                                </div>
                            )} 
                            <Achievement items={certifications} />
                        </div>
                        
                    ) : null
                }

                {
                    awards.visibility ? (
                        <div className='classic-content-area'>
                            {isEditing && (
                                <div className="edit-button-visib">
                                    <IconButton icon="edit" onClick={() => {onEditSection?.('awards')}} />
                                </div>
                            )} 
                            <Achievement items={awards} />
                        </div>
                        
                    ) : null
                }

                {
                    references.visibility ? (
                        <div className='classic-content-area'>
                            {isEditing && (
                                <div className="edit-button-visib">
                                    <IconButton icon="edit" onClick={() => {onEditSection?.('references')}} />
                                </div>
                            )} 
                            <Reference references={references} />
                        </div>
                        
                    ) : null
                }


            </div>

        </div>
    );
};
export default Classic;
