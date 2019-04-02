const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const Article = require('../../models/article');

const events = eventIds => {
  return Event.find({ _id: { $in: eventIds } })
    .then(events => {
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          creator: user.bind(this, event.creator),
        };
      });
    })
    .catch(err => {
      throw err;
    });
};

const user = userId => {
  return User.findById(userId)
    .then(user => {
      return {
        ...user._doc,
        _id: user.id,
        createEvents: events.bind(this, user._doc.createEvents),
      };
    })
    .catch(err => {
      throw err;
    });
};

module.exports = {
  homeList: () => {
    return Article.find().then(articles => {
      return articles.map(item => {
        const formatData = { ...item._doc };
        formatData.createdAt = new Date(formatData.createdAt).getTime();
        formatData.updatedAt = new Date(formatData.updatedAt).getTime();
        return formatData;
      });
    });
  },
  article: args => {
    return Article.findById(args.id).then(article => {
      return article._doc;
    });
  },
  events: () => {
    return Event.find()
      .populate('creator')
      .then(events => {
        return events.map(event => {
          return {
            ...event._doc,
            _id: event.id,
            creator: user.bind(this, event._doc.creator),
          };
        });
      })
      .catch(err => {
        throw err;
      });
  },
  bookings: async () => {
    try {
      const bookings = Booking.find();
      return bookings.map(booking => {
        return {
          ...booking._doc,
          id: booking.id,
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
    } catch (err) {}
  },
  createArticle: args => {
    const articleInput = args.articleInput;
    const { title, content } = articleInput;
    const article = new Article({
      title,
      content,
    });
    return article.save().then(result => {
      return result;
    });
  },
  createEvents: args => {
    const eventInput = args.eventInput;
    const event = new Event({
      title: eventInput.title,
      description: eventInput.description,
      price: +eventInput.price,
      date: new Date(eventInput.date),
      creator: '5c223b0ef8c3b72a23c88364',
    });
    let createEvent;
    return event
      .save()
      .then(result => {
        console.log('result', result);
        createEvent = { ...result._doc, id: result._doc._id.toString() };
        return User.findById('5c223b0ef8c3b72a23c88364');
      })
      .then(user => {
        if (!user) {
          throw new Error('User not found');
        }

        user.createEvents.push(event);
        return user.save();
      })
      .then(result => {
        return createEvent;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  createUser: args => {
    const userInput = args.userInput;
    return User.findOne({ email: userInput.email })
      .then(user => {
        if (user) {
          throw new Error('User exist!');
        }
        return bcrypt.hash(userInput.password, 12);
      })
      .then(hashedPassword => {
        const user = new User({
          email: userInput.email,
          password: hashedPassword,
        });
        return user.save();
      })
      .then(result => {
        return { ...result._doc, password: null, _id: result.id };
      })
      .catch(err => {
        throw err;
      });
  },
  bookEvent: async args => {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: '5c223b0ef8c3b72a23c88364',
      event: fetchedEvent,
    });
    const result = await booking.save();
    return {
      ...result._doc,
      _id: result.id,
      createdAt: new Date(booking._doc.createdAt).toISOString(),
      updatedAt: new Date(booking._doc.updatedAt).toISOString(),
    };
  },
};
