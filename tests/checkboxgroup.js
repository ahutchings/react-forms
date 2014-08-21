/**
 * @jsx React.DOM
 */
'use strict';

var sinon = require('sinon');
var assert = require('assert');

var ReactForms = require('../');
var React = require('react');
var merge = require('react/lib/merge');
var TestUtils = require('react/lib/ReactTestUtils');

var Scalar = ReactForms.schema.Scalar;
var Mapping = ReactForms.schema.Mapping;

var Form = ReactForms.Form;
var Field = ReactForms.Field;
var Fieldset = ReactForms.Fieldset;

var CheckboxGroup = require('../lib/input/CheckboxGroup');

describe('form with CheckboxGroup', function() {

  function TestMapping(props) {
    props = props || {};
    var options = [
      {value: 'yes', name: 'Yes'},
      {value: 'no', name: 'No'}
    ];
    return (
      <Mapping>
        <Scalar
          type="array"
          name="check"
          label={props.label}
          defaultValue={props.defaultValue}
          input={<CheckboxGroup options={options} />}
          />
      </Mapping>
    );
  }

  var form;
  var onChange;
  var onUpdate;
  var fields;
  var boxes;

  function render(props) {
    onChange = sinon.spy();
    onUpdate = sinon.spy();
    props = merge(props, {schema: <TestMapping />, onChange, onUpdate});
    form = TestUtils.renderIntoDocument(Form(props));
    fields = {};
    boxes = TestUtils.scryRenderedDOMComponentsWithTag(form, 'input');
    TestUtils.scryRenderedComponentsWithType(form, Field).forEach(function(field) {
      fields[field.props.value.name] = field;
    });
  }

  it('renders', function() {
    render();
    assert.equal(boxes.length, 2);
    assert.ok(boxes.every((box) => !box.getDOMNode().checked));
  });

  it('renders with default value', function() {
    render({defaultValue: {check: ['yes']}});
    assert.equal(boxes.length, 2);
    assert.ok(boxes[0].getDOMNode().checked);
    assert.ok(!boxes[1].getDOMNode().checked);
  });

  it('reacts on onChange', function() {
    render();
    assert.equal(boxes.length, 2);
    assert.ok(boxes.every((box) => !box.getDOMNode().checked));
    TestUtils.Simulate.change(boxes[1].getDOMNode(), {target: {checked: true, value: 'no'}});
    assert.ok(!boxes[0].getDOMNode().checked);
    assert.ok(boxes[1].getDOMNode().checked);
    TestUtils.Simulate.change(boxes[0].getDOMNode(), {target: {checked: true, value: 'yes'}});
    assert.ok(boxes.every((box) => box.getDOMNode().checked));
  });
});

