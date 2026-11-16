import './DescriptionInput.css';

import DeleteButton from '../DeleteButton/DeleteButton';
import AddButton from '../AddButton/AddButton';

export interface Description {
    Id?: number;
    WorkExperienceId?: number;
    ProjectId?: number;
    Description: string;
}

interface DescriptionInputProps {
    value: Description[];
    onChange: (updatedDescriptions: Description[]) => void;
}

const DescriptionInput = ({ value, onChange }: DescriptionInputProps) => {

    const handleChange = (index: number, description: string) => {
        const updatedDescriptions = [...value];

        updatedDescriptions[index] = {
            ...updatedDescriptions[index],
            Description: description
        };

        onChange(updatedDescriptions);
    };

    const handleAdd = () => {
        onChange([
            ...value,
            { Description: '' }
        ]);
    };

    const handleDelete = (index: number) => {
        onChange(value.filter((_, itemIndex) => itemIndex !== index));
    };

    return (
        <div className="description-input-container">

            {value.map((description, index) => (
                <div className="description-input-row" key={description.Id ?? index} >

                    <input
                        type="text"
                        className="description-input-field"
                        value={description.Description}
                        onChange={(e) =>
                            handleChange(index, e.target.value)
                        }
                        placeholder="Enter description..."
                    />                    

                    <DeleteButton iconOnly onClick={() => handleDelete(index)} />

                </div>
            ))}

            <AddButton label="Add description" onClick={handleAdd} />            

        </div>
    );
};

export default DescriptionInput;
