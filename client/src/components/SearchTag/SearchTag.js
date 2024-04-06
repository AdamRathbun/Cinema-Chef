import React, { useState } from 'react';
import './SearchTag.scss';

function SearchTag({ tags, onSearch, searchType }) {
  const [selectedTag, setSelectedTag] = useState('');

  const handleTagChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedTag(selectedValue);
    onSearch(selectedValue, searchType);
  };

  return (
    <div>
      <select id="tags" value={selectedTag} onChange={handleTagChange}>
        <option value="">Select</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>
    </div>
  );
}

export default SearchTag;