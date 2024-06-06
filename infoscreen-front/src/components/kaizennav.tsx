import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';

const KaizenNavbar: React.FC = () => {
    const [org, setOrg] = React.useState('default');

    const handleOrgChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setOrg(event.target.value);
    };

    return (
        <nav className="flex flex-col items-center justify-between bg-blue-500">
            <div className="w-full flex justify-between items-center mb-4">
                <div className="flex items-center pr-6 ml-2">
                    <select value={org} onChange={handleOrgChange} className="w-64 h-10 mt-1 px-5 py-2 border border-gray-700 rounded box-border transition-colors bg-gray-900 text-blue-400 focus:border-blue-400 focus:ring-blue-400">
                        <option value="default">Select Org</option>
                        {/* Add more options as needed */}
                        <option value="org1">Org 1</option>
                        <option value="org2">Org 2</option>
                    </select>
                </div>
                <div className="flex items-center pr-6 mr-2">
                    <Link to="/kaizenview" className="flex items-center font-semibold text-lg tracking-tight text-white mr-4 border-r border-white pr-4">
                        Go to Kaizen View
                        <FontAwesomeIcon icon={faPaperPlane} className="ml-2 pr-2 fa-lg" />
                    </Link>
                    <Link to="/admin" className="flex items-center font-semibold text-lg tracking-tight text-white">
                        Manage Users
                        <FontAwesomeIcon icon={faUser} className="ml-2 fa-lg" />
                    </Link>
                </div>
            </div>
            <div className="w-full">
                <button className="w-full text-sm px-5 mr-2 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white">
                    <FontAwesomeIcon icon={faCog} /> Settings
                </button>
            </div>
        </nav>
    );
};

export default KaizenNavbar;