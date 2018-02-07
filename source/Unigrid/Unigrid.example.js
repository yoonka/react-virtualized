/** @flow */
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Unigrid} from 'unigrid';
import {
  ContentBox,
  ContentBoxHeader,
  ContentBoxParagraph,
} from '../demo/ContentBox';
import {LabeledInput, InputRow} from '../demo/LabeledInput';
import AutoSizer from '../AutoSizer';
import MultiGrid from '../MultiGrid';
import styles from './Unigrid.example.css';

const STYLE = {
  border: '1px solid #ddd',
};
const STYLE_BOTTOM_LEFT_GRID = {
  borderRight: '2px solid #aaa',
  backgroundColor: '#f7f7f7',
};
const STYLE_TOP_LEFT_GRID = {
  borderBottom: '2px solid #aaa',
  borderRight: '2px solid #aaa',
  fontWeight: 'bold',
};
const STYLE_TOP_RIGHT_GRID = {
  borderBottom: '2px solid #aaa',
  fontWeight: 'bold',
};
const ROWS_COUNT = 2000;
const COLS_COUNT = 100;

export default class UnigridExample extends PureComponent {
  static contextTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      fixedColumnCount: 2,
      fixedRowCount: 1,
      scrollToColumn: 0,
      scrollToRow: 0,
    };

    this._cellRenderer = this._cellRenderer.bind(this);
    this._onFixedColumnCountChange = this._createEventHandler(
      'fixedColumnCount',
    );
    this._onFixedRowCountChange = this._createEventHandler('fixedRowCount');
    this._onScrollToColumnChange = this._createEventHandler('scrollToColumn');
    this._onScrollToRowChange = this._createEventHandler('scrollToRow');
  }

  generateData(r, c) {
    const rows = [];
    for (let i=0; i<r; i++) {
      const cols = {};
      for (let j=0; j<c; j++) {
        cols[j] = `row ${i} col ${j}`;
      }
      rows.push(cols);
    }
    return rows;
  }

  componentWillMount() {
    const data = this.generateData(ROWS_COUNT, COLS_COUNT);
    const cells = Object.keys(data[0]);
    // console.log('data', data, 'cells', cells);

    const table = {
      className: 'unigrid',
      select: 'all',
      cells
    };

    const unigrid = Unigrid.create({data, table}, {});
    // console.log('unigrid', unigrid);
    this.unigrid = unigrid;
  }

  render() {
    return (
      <ContentBox>
        <ContentBoxHeader
          text="MultiGrid"
          sourceLink="https://github.com/bvaughn/react-virtualized/blob/master/source/MultiGrid/MultiGrid.example.js"
          docsLink="https://github.com/bvaughn/react-virtualized/blob/master/docs/MultiGrid.md"
        />

        <ContentBoxParagraph>
          This component stitches together several grids to provide a fixed
          column/row interface.
        </ContentBoxParagraph>

        <InputRow>
          {this._createLabeledInput(
            'fixedColumnCount',
            this._onFixedColumnCountChange,
          )}
          {this._createLabeledInput(
            'fixedRowCount',
            this._onFixedRowCountChange,
          )}
          {this._createLabeledInput(
            'scrollToColumn',
            this._onScrollToColumnChange,
          )}
          {this._createLabeledInput('scrollToRow', this._onScrollToRowChange)}
        </InputRow>

        <AutoSizer disableHeight>
          {({width}) => (
            <MultiGrid
              {...this.state}
              cellRenderer={this._cellRenderer}
              columnWidth={100}
              columnCount={COLS_COUNT}
              enableFixedColumnScroll
              enableFixedRowScroll
              height={500}
              rowHeight={40}
              rowCount={ROWS_COUNT}
              style={STYLE}
              styleBottomLeftGrid={STYLE_BOTTOM_LEFT_GRID}
              styleTopLeftGrid={STYLE_TOP_LEFT_GRID}
              styleTopRightGrid={STYLE_TOP_RIGHT_GRID}
              width={width}
            />
          )}
        </AutoSizer>
      </ContentBox>
    );
  }

  _cellRenderer({columnIndex, key, rowIndex, style}) {
    const row = this.unigrid.props.children[rowIndex];
    const col = row.props.children[columnIndex];
    const elem =  React.cloneElement(col, {style, key});
    // console.log('row:', rowIndex, 'col:', columnIndex, 'elem:', elem);
    return elem;
    /*return (
      <div className={styles.Cell} key={key} style={style}>
        {columnIndex}, {rowIndex}
      </div>
    );*/
  }

  _createEventHandler(property) {
    return event => {
      const value = parseInt(event.target.value, 10) || 0;

      this.setState({
        [property]: value,
      });
    };
  }

  _createLabeledInput(property, eventHandler) {
    const value = this.state[property];

    return (
      <LabeledInput
        label={property}
        name={property}
        onChange={eventHandler}
        value={value}
      />
    );
  }
}
