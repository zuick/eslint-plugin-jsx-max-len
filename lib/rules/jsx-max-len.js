"use strict";

module.exports = function(context) {
  /**
   * Computes the length of a line that may contain tabs. The width of each
   * tab will be the number of spaces to the next tab stop.
   * @param {string} line The line.
   * @param {int} tabWidth The width of each tab stop in spaces.
   * @returns {int} The computed line length.
   * @private
   */
  function computeLineLength(line, tabWidth) {
    var extraCharacterCount = 0;
    line.replace(/\t/g, function(match, offset) {
      var totalOffset = offset + extraCharacterCount,
          previousTabStopOffset = tabWidth ? totalOffset % tabWidth : 0,
          spaceCount = tabWidth - previousTabStopOffset;
      extraCharacterCount += spaceCount - 1;  // -1 for the replaced tab
    });
    return line.length + extraCharacterCount;
  }

  function getComponentName( node ){
    if( node.name.type === 'JSXIdentifier' ){
      return node.name.name;
    }
    return '';
  }

  function getPropName(propNode) {
    if (propNode.type === 'JSXSpreadAttribute') {
      return sourceCode.getText(propNode.argument);
    }
    return propNode.name.name;
  }

  var sourceCode = context.getSourceCode();
  // The options object must be the last option specified…
  var lastOption = context.options[context.options.length - 1];
  var options = typeof lastOption === "object" ? Object.create(lastOption) : {};

  var tabWidth = options.tabWidth || 4;
  var lineMaxLength = options.lineMaxLength || 120;
  var maxAttributesPerLine = options.maxAttributesPerLine || 1;

  return {
    JSXOpeningElement: function(node) {
      // check if node on single line
      if( node.loc.start.line === node.loc.end.line ){
        // check if JSX node line overflow line max length

        var lineLength = computeLineLength( sourceCode.lines[node.loc.end.line-1], tabWidth );
        if( lineLength > lineMaxLength && node.attributes.length > 1 ){
          context.report({
            node: node,
            message: 'Consider multi-line attributes for ' + getComponentName( node )
          });
        }

      }else{
        // check every line on max attributes per line
        var props = {};
        node.attributes.forEach(function(decl) {
          var line = decl.loc.start.line;
          if (props[line]) {
            props[line].push(decl);
          } else {
            props[line] = [decl];
          }
        });

        for (var line in props) {
          if (!props.hasOwnProperty(line)) {
            continue;
          }
          if (props[line].length > maxAttributesPerLine) {
            var name = getPropName(props[line][maxAttributesPerLine]);
            context.report({
              node: props[line][maxAttributesPerLine],
              message: 'Prop `' + name + '` must be placed on a new line'
            });
            break;
          }
        }

      }
    }
  };
};

module.exports.schema = [{
  "type": "object",
  "properties": {
    "lineMaxLength": {
      "type": "integer",
      "minimum": 0
    },
    "tabWidth": {
      "type": "integer",
      "minimum": 0
    }
  }
}];
