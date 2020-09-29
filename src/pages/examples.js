import React from 'react';
import classnames from 'classnames';
import { graphql } from 'gatsby';
import unique from 'array-unique';

import Layout from '../components/Layout';
import ExCategoryList from '../components/ExCategoryList';
import Searchbar from '../components/Searchbar';

import grid from '../styles/grid.module.css';

const Examples = ({ data }) => {
  let examples = data.allFile.nodes;

  let categories = unique(
    examples.map((file) => {
      return file.relativeDirectory.split('/')[0];
    })
  );

  let subcategories = {};
  categories.forEach((c) => {
    subcategories[c] = unique(
      examples.map((r) => {
        if (r.relativeDirectory.split('/')[0] === c)
          return r.relativeDirectory.split('/')[1];
        else return null;
      })
    );
  });

  return (
    <Layout>
      <div className={grid.grid}>
        <h1 className={grid.col8}>Examples</h1>
        <h3 className={grid.col3}>
          Short, prototypical programs exploring the basics of programming with
          Processing.
        </h3>
        <Searchbar
          placeholder={'Search in the Examples...'}
          large
          className={grid.push1}
        />
        <ul className={classnames(grid.col8, grid.nest)}>
          {categories.map((c, key) => {
            let categoryRefs = examples.filter((ref) => {
              return ref.relativeDirectory.split('/')[0] === c;
            });
            return (
              <ExCategoryList
                key={key + 'c'}
                category={c}
                categoryRefs={categoryRefs}
                subcategories={subcategories[c]}
              />
            );
          })}
        </ul>
      </div>
    </Layout>
  );
};

export default Examples;

export const query = graphql`
  query {
    allFile(
      filter: {
        sourceInstanceName: { eq: "examples" }
        childMdx: { fields: { locale: { eq: "en" } } }
      }
    ) {
      nodes {
        name
        relativeDirectory
        childMdx {
          frontmatter {
            slug
            title
          }
        }
      }
    }
  }
`;
