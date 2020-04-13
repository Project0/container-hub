const core = require('@actions/core');
const { graphql } = require("@octokit/graphql");
const { createActionAuth } = require("@octokit/auth-action");

const queryTagsAndReleases = `{
  repository(name: "exim", owner: "exim") {
    name
     tags: refs(refPrefix: "refs/tags/", last: 30) {
      edges {
        node {
          target {
            ... on Tag {
              name
              target {
                ... on Commit {
                  committedDate
                }
              }
            }
          }
        }
      }
    }
    releases(last: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
      nodes {
        name
        createdAt
        url
      }
    }
  }
}`;

async function run() {
  try {
    const actionAuth = createActionAuth()
    const auth = await actionAuth()
    const graphqlWithAuth = graphql.defaults({
      headers: {
        authorization: `${auth.type} ${auth.token}`
      }
    });


    repoOwner = core.getInput('owner', {required: true});
    repoName = core.getInput('name', {required: true});
    originVersion = core.getInput('version', {required: true});
    versionMatch = core.getInput('match', {required: false});
    core.info(`Check for new releases in ${repoOwner}/${repoName} against ${originVersion}`)

    const { lastVersions } = await graphqlWithAuth({
      query: `query lastVersions($owner: String!, $repo: String!, $num: Int = 100) {
        repository(owner:$owner, name:$repo) {
          tags: refs(refPrefix: "refs/tags/", last: $num) {
            edges {
              node {
                target {
                  ... on Tag {
                    name
                    target {
                      ... on Commit {
                        committedDate
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`,
      owner: repoOwner,
      repo: repoName
    })

    core.info(lastVersions)
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();