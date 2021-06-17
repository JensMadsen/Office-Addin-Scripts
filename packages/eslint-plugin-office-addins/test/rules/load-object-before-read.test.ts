import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import rule from '../../src/rules/load-object-before-read';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('load-object-before-read', rule, {
  valid: [ 
    {
      code: `
        var sheetName = 'Sheet1';
        var rangeAddress = 'A1:B2';
        var myRange = context.workbook.worksheets.getItem(sheetName).getRange(rangeAddress);  
        myRange.load('address');
        context.sync()
          .then(function () {
            console.log (myRange.address);   // ok
          });`
    },
    {
      code: `
        var property = worksheet.getItem("sheet");
        property.load('G2');
        var variableName = property.G2;`
    },
    {
      code: `
        var selectedRange = context.workbook.getSelectedRange();
        selectedRange.load('values');
        if(selectedRange.values === [2]){}`
    },
    {
      code: `
        var selectedRange;
        var selectedRange = context.workbook.getSelectedRange();
        selectedRange.load('values');
        console.log(selectedRange.values);`
    },
    {
      code: `
        var myRange = context.workbook.worksheets.getSelectedRange();
        myRange = context.workbook.worksheets.getItem(sheetName).getRange(rangeAddress);
        myRange.load('values');
        console.log(myRange.values);`
    },
    {
      code: `
        var myRange = context.workbook.worksheets.getSelectedRange();
        myRange.load('values');
        myRange.load('address');
        console.log(myRange.address);
        console.log(myRange.values);`
    },
    {
      code: `
        var myRange = context.thisIsNotAGetFunction();
        myRange.load('values')
        var test = myRange.values;
        var myRange = context.workbook.worksheets.getSelectedRange();`
    },
    {
      code: `
        var myRange = context.workbook.worksheets.getSelectedRange();
        myRange = context.notAGetFunction;
        myRange.load('values');
        var test = myRange.values;`
    },
    {
      code: `
        var myRange = context.workbook.worksheets.getSelectedRange();
        myRange = context.notAGetFunction;
        var test = myRange.values;`
    },
    {
      code: `
        var range = worksheet.getRange("A1");
        range.format.fill.color = "red";
        range.numberFormat = "0.00%";
        range.values = [[1]];`
    },
    {
      code: `
        var range = worksheet.getRange("A1");
        range.load("format/fill/size");
        console.log(range.format.fill.size);`
    },
  ],
  invalid: [
    {
      code: `
        var sheetName = 'Sheet1';
        var rangeAddress = 'A1:B2';
        console.log(rangeAddress);
        var myRange = context.workbook.worksheets.getItem(sheetName).getRange(rangeAddress);  
        myRange.load('address');
        context.sync()
          .then(function () {
            console.log (myRange.values);  // not ok as it was not loaded
          });`,
      errors: [{ messageId: "loadBeforeRead", data: { name: "myRange", loadValue: "values" } }]
    },
    {
      code: `
        var selectedRange = context.workbook.getSelectedRange();
        if(selectedRange.values === ["sampleText"]){}`,
      errors: [{ messageId: "loadBeforeRead", data: { name: "selectedRange", loadValue: "values" } }]
    },
    {
      code: `
        var myRange = context.workbook.worksheets.getItem("sheet").getRange("A1");
        console.log (myRange.adress);`,
      errors: [{ messageId: "loadBeforeRead", data: { name: "myRange", loadValue: "adress" }  }]
    },
    {
      code: `
        var selectedRange = context.workbook.getSelectedRange();
        console.log(selectedRange.values);`,
      errors: [{ messageId: "loadBeforeRead", data: { name: "selectedRange", loadValue: "values" }  }]
    },
    {
      code: `
        var selectedRange = context.workbook.getSelectedRange();
        console.log(selectedRange.values);
        selectedRange.load('values')`,
      errors: [{ messageId: "loadBeforeRead", data: { name: "selectedRange", loadValue: "values" }  }]
    },
    {
      code: `
        var selectedRange = context.workbook.getSelectedRange();
        var test = selectedRange.values;`,
      errors: [{ messageId: "loadBeforeRead", data: { name: "selectedRange", loadValue: "values" }  }]
    },
    {
      code: `
        var myRange;
        myRange = context.workbook.worksheets.getSelectedRange();
        var test = myRange.values;`,
      errors: [{ messageId: "loadBeforeRead", data: { name: "myRange", loadValue: "values" }  }]
    },
    {
      code: `
        var myRange = context.workbook.worksheets.getSelectedRange();
        myRange = context.workbook.worksheets.getItem(sheetName).getRange(rangeAddress);
        var test = myRange.values;`,
      errors: [{ messageId: "loadBeforeRead", data: { name: "myRange", loadValue: "values" }  }]
    },
    {
      code: `
        var range = worksheet.getRange("A1");
        range.load("range/format/fill/size");
        console.log(range.format.fill.color);`,
      errors: [{ messageId: "loadBeforeRead", data: { name: "range", loadValue: "format/fill/color" }  }]
    },
  ]
});