// @ts-nocheck

'use strict';


// Abbreviated example
// const stylelint = require('stylelint');
// const isStandardSyntaxRule = require("stylelint/lib/utils/isStandardSyntaxRule");
// const isStandardSyntaxSelector = require("stylelint/lib/utils/isStandardSyntaxSelector");
// const parseSelector = require("stylelint/lib/utils/parseSelector");
// const matchesStringOrRegExp = require("stylelint/lib/utils/matchesStringOrRegExp");

// const ruleName = "plugin/stylelint-deprecate-css";
// const messages = stylelint.utils.ruleMessages(ruleName, {
//     unexpected: (tagName) => `Unexpected tag ${tagName} without class qualifier`
// });

// module.exports = stylelint.createPlugin(ruleName, function (
//     primaryOption,
//     secondaryOptionObject
// ) {
//     return function (postcssRoot, postcssResult) {
//         const validOptions = stylelint.utils.validateOptions(
//             postcssResult,
//             ruleName,
//             {
//                 /* .. */
//             }
//         );

//         if (!validOptions) {
//             return;
//         }

//         // ... some logic ...
//         stylelint.utils.report({
//             /* .. */
//         });
//     };
// });

// module.exports.ruleName = ruleName;
// module.exports.messages = messages;

// const _ = require('lodash');
const stylelint = require('stylelint');
// const isStandardSyntaxRule = require("stylelint/lib/utils/isStandardSyntaxRule");
// const isStandardSyntaxSelector = require("stylelint/lib/utils/isStandardSyntaxSelector");
// const parseSelector = require("stylelint/lib/utils/parseSelector");
// const matchesStringOrRegExp = require("stylelint/lib/utils/matchesStringOrRegExp");


// const _ = require('lodash');
// const isStandardSyntaxAtRule = require('stylelint/lib/utils/isStandardSyntaxAtRule');
// const report = require('stylelint/lib/utils/report');
// const ruleMessages = require('stylelint/lib/utils/ruleMessages');
// const validateOptions = require('stylelint/lib/utils/validateOptions');
// const vendor = require('stylelint/lib/utils/vendor');

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
// const messages = stylelint.utils.ruleMessages(ruleName, {
//     // unexpected: (tagName) => `Unexpected tag ${tagName} without class qualifier`
//     rejected: (property) => `Unexpected property "${property}"`,
// });

const messages = ruleMessages(ruleName, {
    rejected: (property) => `Unexpected property "${property}"`,
});

function rule(list) {
    return (root, result) => {
        const validOptions = validateOptions(result, ruleName, {
            actual: list,
            possible: [_.isString, _.isRegExp],
        });

        // Get full selector
        // const selector = _.get(rule, 'raws.selector.raw', rule.selector);

        if (!validOptions) {
            return;
        }

        root.walkDecls((decl) => {
            // const prop = decl.prop;
            const selector = _.get(rule, 'raws.selector.raw', rule.selector);

            // if (!isStandardSyntaxProperty(prop)) {
            //     return;
            // }

            // if (isCustomProperty(prop)) {
            //     return;
            // }

            // if (isLessVariable(prop)) {
            //     // console.log('hey')
            // }

            // if (!matchesStringOrRegExp(vendor.unprefixed(selector), list)) {
            //     return;
            // }

            // Non-outputting Less mixin definition (e.g. .mixin() {})
            if (selector.endsWith(')') && !selector.includes(':')) {
                return;
            }

            report({
                message: messages.rejected(selector),
                node: decl,
                result,
                ruleName,
            });
        });
    };
}

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
// module.exports = rule;
module.exports = stylelint.createPlugin(ruleName, rule);

// const rule = function (primaryOption) {
//     return function (root, result) {
//         let validOptions = stylelint.utils.validateOptions(result, ruleName, {
//             actual: primaryOption,
//             possible: [_.isString]
//         });
//         if (!validOptions) {
//             return;
//         }

//         function checkSelector(selectorNode, ruleNode) {
//             let combinedSegments = selectorNode.split(node => {
//                 return node.type === 'combinator';
//             });

//             combinedSegments.forEach(segment => {
//                 let unqualifiedTagNode;
//                 segment.forEach(node => {
//                     if (node.type === 'class' && matchesStringOrRegExp(node.value, primaryOption)) {
//                         unqualifiedTagNode = node;
//                     }
//                     if (node.type === 'other') {
//                         unqualifiedTagNode = void 0;
//                     }
//                 });

//                 if (unqualifiedTagNode) {
//                     stylelint.utils.report({
//                         ruleName: ruleName,
//                         result: result,
//                         node: ruleNode,
//                         message: messages.unexpected(unqualifiedTagNode.value),
//                         word: unqualifiedTagNode
//                     });
//                 }
//             });
//         }

//         function checkSelectorRoot(selectorRootNode, ruleNode) {
//             selectorRootNode.each(selectorNode => {
//                 checkSelector(selectorNode, ruleNode);
//             });
//         }

//         root.walkRules(ruleNode => {
//             if (!isStandardSyntaxRule(ruleNode)) {
//                 return;
//             }
//             if (!isStandardSyntaxSelector(ruleNode.selector)) {
//                 return;
//             }
//             if (
//                 ruleNode.nodes.some(
//                     node => ["rule", "atrule"].indexOf(node.type) !== -1
//                 )
//             ) {
//                 // Skip unresolved nested selectors
//                 return;
//             }

//             ruleNode.selectors.forEach(selector => {
//                 parseSelector(selector, result, ruleNode, container =>
//                     checkSelectorRoot(container, ruleNode)
//                 );
//             });
//         });
//     };
// };
// rule.primaryOptionArray = true;
// rule.ruleName = ruleName;
// rule.messages = messages;
// module.exports = stylelint.createPlugin(ruleName, rule);