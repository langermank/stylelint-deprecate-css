const stylelint = require('stylelint');
const _ = require('lodash');
const isCustomProperty = require('stylelint/lib/utils/isCustomProperty');
const isStandardSyntaxProperty = require('stylelint/lib/utils/isStandardSyntaxProperty');
const isLessVariable = require('stylelint/lib/utils/isLessVariable');
const matchesStringOrRegExp = require('stylelint/lib/utils/matchesStringOrRegExp');
const report = require('stylelint/lib/utils/report');
const ruleMessages = require('stylelint/lib/utils/ruleMessages');
const validateOptions = require('stylelint/lib/utils/validateOptions');
const vendor = require('stylelint/lib/utils/vendor');

const ruleName = 'plugin/stylelint-deprecate-css';
const messages = ruleMessages(ruleName, {
    unexpected: (property) => `Deprecated classname "${property}"`,
});

module.exports = stylelint.createPlugin(ruleName, list => {
    return (root, result) => {

        // list = array of classnames
        const validOptions = stylelint.utils.validateOptions(result, ruleName, {
            actual: list,
            possible: [_.isString, _.isRegExp],
        })

        if (!validOptions) {
            return
        }

        root.walkRules(rule => {
            // find any selector and return list of matches
            // compare list of matches to list
            // return matches to list
            // return error message


            // trying to write a regex to find less mixins
            // could do the same for variables @rule
            // const matchMixin = selector => selector.match(/\.[\w\-] +\(.*\)/)
            // Non-outputting Less mixin definition (e.g. .mixin() {})
            // if (match.endsWith(')') && match.includes(':')) {
            // if (match.endsWith(')')) {
            //     // return;
            //     console.log(match);
            // }

            // find any css class started with . (I think)
            const match = selector => selector.match(/\.[-\w]+/g)

            // find all css classes in files
            const matches = match(rule.selector)

            // compare list to css classes in files and find matches
            const intersection = list.filter(element => matches.includes(element));
            console.log(matches)

            // if a match exists throw error
            // this is probably kinda wrong
            for (const item of Array.from(intersection)) {
                if (intersection) {
                    stylelint.utils.report({
                        message: messages.unexpected(intersection),
                        node: rule,
                        result,
                        ruleName
                    })
                }
            }

        });
    };
});

// allow consumer to pass items as array in .stylelintrc
module.exports.rule.primaryOptionArray = true

module.exports.ruleName = ruleName
module.exports.messages = messages
