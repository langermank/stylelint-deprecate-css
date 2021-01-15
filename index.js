const stylelint = require('stylelint');
const _ = require('lodash');
const ruleMessages = require('stylelint/lib/utils/ruleMessages');
const ruleName = 'plugin/stylelint-deprecate-css';
const messages = ruleMessages(ruleName, {
    unexpected: (type, property) =>
        `${type}: "${property}"`,
});

const matchRegEx = {
    DEPRECATED_MIXINS: /(\.|#)[\w\-]+(?=\(.*\))/g,
    DEPRECATED_STYLES: /(\.|#)[\w\-:\+\s#.]+$/g,
    DEPRECATED_VARIABLES: /@[\w-]+/g,
};

module.exports = stylelint.createPlugin(ruleName, (list) => {
    return (root, result) => {
        const validOptions = stylelint.utils.validateOptions(result, ruleName, {
            actual: list,
            possible: [_.isString, _.isRegExp],
        });

        if (!validOptions) {
            return;
        }

        Object.keys(matchRegEx).forEach((regExKey) => {
            const curRegexMatch = matchRegEx[regExKey];

            root.walkRules((rule) => {
                const ruleType = regExKey === 'DEPRECATED_VARIABLES' ? 'params' : 'selector';
                const ruleMatched = rule[ruleType] && rule[ruleType].match(curRegexMatch);
                if (ruleMatched) {
                    let regExLoopKey = regExKey;
                    list.forEach((element) => {
                        if (matchRegEx[element]) {
                            regExLoopKey = element;
                        }
                        if (regExKey !== regExLoopKey) {
                            return false;
                        }

                        if (ruleMatched.includes(element)) {
                            return stylelint.utils.report({
                                message: messages.unexpected(
                                    regExKey.replace(/_/g, ' ').slice(0, -1),
                                    element,
                                ),
                                node: rule,
                                result,
                                ruleName,
                            });
                        }
                    });
                }
            });
        });
    };
});

module.exports.rule.primaryOptionArray = true;

module.exports.ruleName = ruleName;
module.exports.messages = messages;