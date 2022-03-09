var expect = require('chai').expect,
  sdk = require('postman-collection'),
  fs = require('fs'),
  path = require('path'),
  {
    parseBody
  } = require('../../lib/util/parseBody'),
  collectionsPath = './fixtures';

describe('parseBody function', function () {

  it('should parse a raw json Body', function () {
    const collection = new sdk.Collection(JSON.parse(
        fs.readFileSync(path.resolve(__dirname, collectionsPath, './sample_collection.json').toString()))),
      body = collection.items.members[8].request.body,
      indentation = '  ',
      bodyTrim = false,
      expectedBody = '$body = {\n  "json": "Test-Test"\n};\n';
    let bodySnippet = parseBody(body, indentation, bodyTrim, 'application/json');
    expect(bodySnippet).to.equal(expectedBody);
  });

  it('should parse a raw json Body with indentation', function () {
    const collection = new sdk.Collection(JSON.parse(
        fs.readFileSync(path.resolve(__dirname, collectionsPath, './sample_collection.json').toString()))),
      body = collection.items.members[8].request.body,
      indentation = '   ',
      bodyTrim = false,
      expectedBody = '$body = {\n   "json": "Test-Test"\n};\n';
    let bodySnippet = parseBody(body, indentation, bodyTrim, 'application/json');
    expect(bodySnippet).to.equal(expectedBody);
  });

  it('should parse a raw xml Body', function () {
    const collection = new sdk.Collection(JSON.parse(
        fs.readFileSync(path.resolve(__dirname, collectionsPath, './sample_collection.json').toString()))),
      body = collection.items.members[10].request.body,
      indentation = '   ',
      bodyTrim = false,
      expectedBody = '$body = \'<xml>\n\tTest Test\n</xml>\';\n';
    let bodySnippet = parseBody(body, indentation, bodyTrim, 'application/json');
    expect(bodySnippet).to.equal(expectedBody);
  });

  it('should return form-url-encoded params"', function () {
    const collection = new sdk.Collection(JSON.parse(
        fs.readFileSync(path.resolve(__dirname, collectionsPath, './sample_collection.json').toString()))),
      body = collection.items.members[7].request.body,
      indentation = '  ',
      bodyTrim = false,
      pesult = '$body = [\n\'form_params\' => [\n' +
      '  \'1\' => \'\\\'a\\\'\',\n' +
      '  \'2\' => \'"b"\',\n' +
      '  \'\\\'3\\\'\' => \'c\',\n' +
      '  \'"4"      \' => \'d      \',\n' +
      '  \'Special\' => \'!@#$%&*()^_=`~\',\n' +
      '  \'more\' => \',./\\\';[]}{":?><|\\\\\\\\\'\n' +
      ']];\n',
      result = parseBody(body, indentation, bodyTrim, 'application/x-www-form-urlencoded');
    expect(result).to.equal(pesult);

  });
});