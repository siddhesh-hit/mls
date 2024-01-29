const mongoose = require("mongoose");

const ImageSchema = require("./imageSchema");

const memberLegislativeSchema = new mongoose.Schema(
  {
    basic_info: {
      house: {
        type: String,
      },
      assembly_number: {
        type: String,
      },
      profile: ImageSchema,
      name: {
        type: String,
      },
      surname: {
        type: String,
      },
      constituency: {
        type: String,
      },
      party: {
        type: String,
      },
      gender: {
        type: String,
      },
      district: {
        type: String,
      },
      first_time_elected: {
        type: String,
      },
      date_of_birth: {
        type: String,
      },
      place_of_birth: {
        type: String,
      },
      education: {
        type: String,
      },
      language: {
        type: String,
      },
      marital_status: {
        type: String,
      },
      children: {
        type: String,
      },
      business: {
        type: String,
      },
      hobby: {
        type: String,
      },
      foreign_migration: {
        type: String,
      },
      address: {
        type: String,
      },
      mobile_number: {
        type: String,
      },
      email: {
        type: String,
      },
    },
    political_journey: [
      {
        date: {
          type: String,
        },
        title: {
          type: String,
        },
      },
    ],
    election_data: {
      constituency: {
        type: String,
      },
      total_electorate: {
        type: String,
      },
      total_valid_voting: {
        type: String,
      },
      member_election_result: [
        {
          candidate_name: {
            type: String,
          },
          votes: {
            type: String,
          },
          party: {
            type: String,
          },
        },
      ],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

delete mongoose.models.LegislativeMember;
delete mongoose.modelNames.LegislativeMember;

const MemberLegislative = mongoose.model(
  "MemberLegislative",
  memberLegislativeSchema
);

module.exports = MemberLegislative;
