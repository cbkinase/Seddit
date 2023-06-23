from itertools import islice


def chunk(it, size=1_000_000):
    # Convert iterable into iterator object

    # Take next 'size' from iterator using islice

    # Lambda fn returns a tuple of the next 'size' elements

    # Creates an iterator that will keep
    # calling the lambda function until it returns
    # the second argument, in this case, an empty tuple.
    # This happens when islice() runs out of elements to
    # yield, and so tuple(islice(it, size)) returns an empty tuple.

    # SQLAlchemy isn't so good with inserting lots (e.g. millions)
    # of records at a time, so we do what we must...

    it = iter(it)
    return iter(lambda: tuple(islice(it, size)), ())
