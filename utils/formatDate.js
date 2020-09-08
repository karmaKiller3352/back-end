const options = {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
};

const formatDate = (date) => date.toLocaleString('en-US', options);

module.exports = formatDate;
