'use strict';

const { models } = require('mongoose')
const ObjectID = require('mongodb').ObjectID

const pkginfo = require('../../package.json');
const spec = require('../spec');

exports.getPoll = async ctx => {
  const { pollId, userId } = ctx.query
  const result = {}

  try {
    result.poll = await models.Poll.getPollInfo({ _id: ObjectID(pollId) }, { userId: Number(userId) })
  } catch (e) {
    console.log(e)
  }

  ctx.res.ok(result, 'poll')
};

exports.makePoll = async ctx => {
  const { userId, postId, options, title } = ctx.request.body
  const result = {}

  try {
    result.poll = await models.Poll.makePoll(userId, { model: 'Post', item: postId }, options, title)
  } catch (e) {
    console.log(e)
  }

  ctx.res.ok(result, 'poll created')
}

exports.vote = async ctx => {
  const { pollId } = ctx.params
  const { userId, idArray = [] } = ctx.request.body
  const result = {}

  try {
    const [ poll ] = await models.Poll.find({ _id: ObjectID(pollId) })
    if (!poll) throw new Error('no poll found')

    result.result = await poll.vote(userId, idArray)
  } catch (e) {
    console.log(e)
  }

  ctx.res.ok(result, !result.result ? 'something went wrong' : 'voted')
}
