import React from 'react';
import PropTypes from 'prop-types';
import renderer from 'react-test-renderer';
import { i18n } from 'interface/RootLocalizationProvider';
import { loadLogSync, parseLog } from './log-tools';

class ParserContextProvider extends React.PureComponent {
  static propTypes = {
    parser: PropTypes.object,
    children: PropTypes.node,
  };

  static childContextTypes = {
    parser: PropTypes.object,
  };

  getChildContext() {
    return {
      parser: this.props.parser,
    };
  }

  render() {
    console.log(this.props.children);
    return this.props.children;
  }
}

export function statistic(analyzer, parser=null) {
  const stat = analyzer.statistic({ i18n });
  const result = renderer.create(<ParserContextProvider parser={parser}>{stat}</ParserContextProvider>).toJSON();
  return result;
} 

/**
 * Perform a test using the Jest snapshot tool (https://jestjs.io/docs/en/snapshot-testing#snapshot-testing-with-jest).
 *
 * This is a consistency test, testing only that the output of the given
 * function (default: statistic()) matches the snapshotted value. See
 * the docs linked above for information on how to update a snapshot.
 *
 * Honestly no longer sure this deserves its own function.
 *
 * @param {object} parserClass - CombatLogParser class. Uninstantiated
 * @param {object} moduleClass - Analyzer or other module. Uninstantiated
 * @param {string} key - Log identifier
 * @param {function} propFn - Function returning serializable output to be tested for consistency. Optional.
 */
export default function snapshotTest(parserClass, moduleClass, key, propFn = statistic) {
  return () => {
    const log = loadLogSync(key);
    const parser = parseLog(parserClass, log);
    expectSnapshot(parser, moduleClass, propFn);
  };
}

export function expectSnapshot(parser, moduleClass, propFn = statistic) {
    const result = propFn(parser.getModule(moduleClass), parser);
    expect(result).toMatchSnapshot();
}
