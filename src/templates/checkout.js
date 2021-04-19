import React from 'react';
import _ from 'lodash';
import {graphql} from 'gatsby';

import components, {Layout} from '../components/index';

export const query = graphql`
  query($url: String) {
    sitePage(path: {eq: $url}) {
      id
    }
  }
`;

export default class Checkout extends React.Component {
    render() {
      console.log(this.props)
        return (
            <Layout {...this.props}>
              <h1> preparing Checkout...</h1>
            {/* <main className={'content' + (_.get(this.props, 'pageContext.frontmatter.page_css_class', null) ? (' ' + _.get(this.props, 'pageContext.frontmatter.page_css_class', null)) : '')}>
                {_.map(_.get(this.props, 'pageContext.frontmatter.sections', null), (section, section_idx) => {
                    let component = _.upperFirst(_.camelCase(_.get(section, 'type', null)));
                    let Component = components[component];
                    return (
                    <Component key={section_idx} {...this.props} section={section} page={this.props.pageContext} site={this.props.pageContext.site} />
                    )
                })}
            </main> */}
            </Layout>
        );
    }
}
