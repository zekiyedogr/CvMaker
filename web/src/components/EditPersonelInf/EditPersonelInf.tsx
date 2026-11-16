
import { useEffect, useState } from 'react';
import './EditPersonelInf.css';
import TextInput from '../TextInput/TextInput';
import FileInput from '../FileInput/FileInput';
import TextArea from '../TextArea/TextArea';

export interface PersonalInformation {
    PhotoUrl: string;
    PhotoFile: File | null;
    FirstName: string;
    LastName: string;
    Profession: string;
    CareerSummary: string;
    CareerGoals: string;
}

interface EditPersonalInfProps {
    data?: Partial<PersonalInformation>;
    onChange: (data: PersonalInformation) => void;
}

const emptyData: PersonalInformation = {
    PhotoUrl: '',
    PhotoFile: null,
    FirstName: '',
    LastName: '',
    Profession: '',
    CareerSummary: '',
    CareerGoals: ''
};

const serverUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');

const EditPersonalInf = ({
    data,
    onChange
}: EditPersonalInfProps) => {

    const [formData, setFormData] = useState<PersonalInformation>({
        ...emptyData,
        ...data
    });

    useEffect(() => {
        setFormData({
            ...emptyData,
            ...data
        });
    }, [data]);

    const handleChange = (name: string, value: string) => {
        const updatedData = {
            ...formData,
            [name]: value
        };

        setFormData(updatedData);
        onChange(updatedData);
    };

    return (
        <div className="personal-inf-form">

            <div className="personal-inf-photo">
                <FileInput
                    label="Profile Photo"
                    name="PhotoFile"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(file) => {
                        if (!file) return;

                        const previewUrl = URL.createObjectURL(file);

                        const updatedData = {
                            ...formData,
                            PhotoUrl: previewUrl,
                            PhotoFile: file
                        };

                        setFormData(updatedData);
                        onChange(updatedData);
                    }}
                />

                {formData.PhotoUrl && (
                    <img
                        src={
                            formData.PhotoUrl.startsWith('blob:')
                                ? formData.PhotoUrl
                                : `${serverUrl}${formData.PhotoUrl}`
                        }
                        alt="Profile preview"
                    />
                )}
            </div>

            <div className="personal-inf-row">

                <div className="personal-inf-field">
                    <TextInput
                        label="First Name"
                        name="FirstName"
                        value={formData.FirstName}
                        onChange={(value) => handleChange('FirstName', value)}
                        placeholder="Enter first name"
                    />
                </div>

                <div className="personal-inf-field">
                    <TextInput
                        label="Last Name"
                        name="LastName"
                        value={formData.LastName}
                        onChange={(value) => handleChange('LastName', value)}
                        placeholder="Enter last name"
                    />
                </div>

            </div>

            <div className="personal-inf-field">
                <TextInput
                    label="Profession"
                    name="Profession"
                    value={formData.Profession}
                        onChange={(value) => handleChange('Profession', value)}
                    placeholder="Enter profession"
                />
            </div>

            <div className="personal-inf-field">
                <TextArea
                    label="Career Summary"
                    name="CareerSummary"
                    value={formData.CareerSummary}
                    onChange={(value) => handleChange('CareerSummary', value)}
                    placeholder="Write a short summary about your career"
                    rows={4}
                />
            </div>

            <div className="personal-inf-field">
                <TextArea
                    label="Career Goals"
                    name="CareerGoals"
                    value={formData.CareerGoals}
                    onChange={(value) => handleChange('CareerGoals', value)}
                    placeholder="Describe your career goals"
                    rows={4}
                />
            </div>

        </div>
    );
};

export default EditPersonalInf;
