import React, { useState } from 'react';

function SearchTag({ tags, onSearch, searchType }) {
  const [selectedTag, setSelectedTag] = useState('');

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  const handleSearch = () => {
    onSearch(selectedTag, searchType);
  };

  return (
    <div>
      <label htmlFor="tags">Select a Tag:</label>
      <select id="tags" value={selectedTag} onChange={handleTagChange}>
        <option value="">Select Tag</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchTag;