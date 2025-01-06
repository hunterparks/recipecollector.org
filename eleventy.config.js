const { EleventyHtmlBasePlugin } = require('@11ty/eleventy');

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy('src/assets');
    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

    // === Custom collections ===
    eleventyConfig.addCollection('tagsList', function (collectionApi) {
        const tagsList = new Set();
        collectionApi.getAll().map((item) => {
            if (item.data.tags) {
                item.data.tags.forEach((tag) => tagsList.add(tag));
            }
        });
        return Array.from(tagsList).filter((tag) => tag !== 'recipe');
    });
    eleventyConfig.addCollection('authorsList', function (collectionApi) {
        const authorsList = new Set();
        collectionApi.getAll().map((item) => {
            if (item.data.author) {
                authorsList.add(item.data.author);
            }
        });
        return Array.from(authorsList);
    });

    // === Custom filters ===
    eleventyConfig.addFilter('authorName', function (value) {
        let [firstName, lastName] = value.split('-');
        firstName = `${firstName.slice(0, 1).toUpperCase()}${firstName.slice(
            1
        )}`;
        lastName = `${lastName.slice(0, 1).toUpperCase()}${lastName.slice(1)}`;
        return `${firstName} ${lastName}`;
    });
    eleventyConfig.addFilter('date', function (value) {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        }).format(value);
    });
    eleventyConfig.addFilter('firstRealTag', function (values) {
        let tag = '';
        for (const value of values) {
            if (value !== 'recipe') {
                tag = value;
                break;
            }
        }
        return tag;
    });
    function pluralize(value, singular, plural) {
        return `${+value} ${+value === 1 ? singular : plural}`;
    }
    eleventyConfig.addFilter('pluralize', function (value, args) {
        return pluralize(value, ...args);
    });
    eleventyConfig.addFilter('pluralizeMinutes', function (value) {
        return pluralize(value, 'min', 'mins');
    });

    return {
        dir: {
            input: 'src',
            data: '_data',
            includes: '_includes',
            layouts: '_layouts',
            output: 'docs',
        },
        pathPrefix: '/'
    };
};
